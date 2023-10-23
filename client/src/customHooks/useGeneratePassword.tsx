import { useState } from "react";

const PASSWORD_LENGTH = 7;

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

function generatePassword() {
  let password = "";

  for (let i = 0; i < PASSWORD_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
}

const useGeneratePassword = () => {
  const [password, setPassword] = useState(generatePassword());

  const regeneratePassword = () => {
    setPassword(generatePassword());
  };

  return { password, regeneratePassword };
};

export default useGeneratePassword;
