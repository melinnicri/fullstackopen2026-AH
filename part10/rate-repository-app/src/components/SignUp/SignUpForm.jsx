import { Pressable, View, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import Text from '../Text';
import FormikTextInput from '../FormikTextInput';
import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: theme.colors.formBg,
  },
  button: {
    alignItems: 'center',
    borderRadius: 5,
    padding: 15,
    backgroundColor: theme.colors.primary,
  },
});

const SignUpForm = () => {
  const formik = useFormikContext();

  return (
    <View style={styles.container}>
      <FormikTextInput name="username" placeholder="Username" />
      <FormikTextInput name="password" placeholder="Password" secureTextEntry />
      <FormikTextInput name="passwordConfirmation" placeholder="Password confirmation" secureTextEntry />
      <Pressable style={styles.button} onPress={formik.handleSubmit}>
        <Text fontWeight="bold" fontSize="subheading" color="white">
          Sign up
        </Text>
      </Pressable>
    </View>
  );
};

export default SignUpForm;