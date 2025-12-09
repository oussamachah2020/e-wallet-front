import { theme } from "@/constants/theme";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  leftIcon?: string;
}

export function Input<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  leftIcon,
}: InputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          <TextInput
            label={label}
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            mode="outlined"
            error={!!error}
            // textColor={theme.colors.textSecondary} // Text color
            cursorColor={theme.colors.secondary} // Cursor color
            placeholderTextColor={theme.colors.textSecondary} // Placeholder color
            outlineStyle={{
              borderRadius: 50,
              borderColor: error ? theme.colors.error : theme.colors.primary,
            }}
            theme={{
              colors: {
                primary: theme.colors.primary, // Focused outline + label color
                onSurfaceVariant: theme.colors.primary, // Label color when not focused
                error: theme.colors.error,
              },
            }}
            left={
              leftIcon ? (
                <TextInput.Icon
                  icon={leftIcon}
                  color={theme.colors.primary} // Icon color
                />
              ) : undefined
            }
            style={styles.input}
          />

          {error && (
            <HelperText type="error" visible={!!error}>
              {error.message}
            </HelperText>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 20,
  },
});
