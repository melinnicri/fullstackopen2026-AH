import { TextInput, View, StyleSheet } from 'react-native';
import { useField } from 'formik';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  inputField: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.fieldBg,
    fontFamily: theme.fonts.main,
  },
  errorInput: {
    borderColor: theme.colors.error,
  },
});

const FormikTextInput = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const showError = meta.touched && meta.error;

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.inputField,
          showError && styles.errorInput
        ]}
        value={field.value}
        onChangeText={(text) => helpers.setValue(text)}
        onBlur={() => helpers.setTouched(true)}
        {...props}
      />
      {showError && <Text color="error">{meta.error}</Text>}
    </View>
  );
};

export default FormikTextInput;