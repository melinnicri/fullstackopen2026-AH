import { Pressable, View, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import Text from '../Text';
import FormikTextInput from '../FormikTextInput';
import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
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

const SignInForm = () => {
  const formik = useFormikContext();

  return (
    <View style={styles.container}>
      <FormikTextInput
        name="username"
        formik={formik}
        placeholder="Username"
      />
      <FormikTextInput
        name="password"
        formik={formik}
        placeholder="Password"
        secureTextEntry
      />
      <Pressable
        testID="signInSubmit"
        style={styles.button}
        onPress={formik.handleSubmit}
      >
        <Text fontWeight="bold" fontSize="subheading" color="white">
          Sign in
        </Text>
      </Pressable>
    </View>
  );
};

export default SignInForm;
