import { useNavigate } from 'react-router';
import { Formik } from 'formik';
import * as yup from 'yup';
import SignUpForm from './SignUpForm';
import useSignUp from '../hooks/useSignUp';
import useSignIn from '../hooks/useSignIn';

const validationSchema = yup.object().shape({
    username: yup
        .string()
        .min(1, 'Username must be at least 1 character long')
        .max(30, 'Username must be at most 30 characters long')
        .required('Username is required'),
    password: yup
        .string()
        .min(5, 'Password must be at least 5 characters long')
        .max(50, 'Password must be at most 50 characters long')
        .required('Password is required'),
    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required'),
    });

    const initialValues = {
    username: '',
    password: '',
    passwordConfirmation: '',
    };

    export const SignUpContainer = ({ onSubmit }) => {
    return (
        <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        >
        {() => <SignUpForm />}
        </Formik>
    );
    };

    const SignUp = () => {
    const [signUp] = useSignUp();
    const [signIn] = useSignIn();
    const navigate = useNavigate();

    const onSubmit = async (values) => {
        const { username, password } = values;

        try {
        await signUp({ username, password });
        await signIn({ username, password });
        navigate('/', { replace: true });
        } catch (e) {
        console.log(e);
        }
    };

    return <SignUpContainer onSubmit={onSubmit} />;
};

export default SignUp;