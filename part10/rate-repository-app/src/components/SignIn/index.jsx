import { useNavigate } from 'react-router';
import { Formik } from 'formik';
import * as yup from 'yup';
import SignInForm from './SignInForm';
import useSignIn from '../../hooks/useSignIn';

export const SignInContainer = ({ onSubmit }) => {
  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .min(5, 'Username must be at least 5 characters long')
      .max(30, 'Username must be a maximum of 30 characters long')
      .required('Username is required'),
    password: yup
      .string()
      .min(5, 'Password must be at least 5 characters long')
      .max(50, 'Password must be a maximum of 50 characters long')
      .required('Password is required'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => <SignInForm />}
    </Formik>
  );
};

const SignIn = () => {
  const navigate = useNavigate();
  const [signIn] = useSignIn();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      await signIn({ username, password });
      navigate('/', { replace: true });
    } catch (e) {
      console.log(e);
    }
  };

  return <SignInContainer onSubmit={onSubmit} />;
};

export default SignIn;
