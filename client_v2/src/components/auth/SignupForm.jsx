import React from 'react';
import { useForm } from 'react-hook-form';

const SignupForm = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <label htmlFor="username">Username:</label>
      <input {...register("username")} required />
      
      <label htmlFor="password">Password:</label>
      <input type="password" {...register("password")} required />
      
      <label htmlFor="email">Email:</label>
      <input type="email" {...register("email")} required />
      
      <input type="submit" value="Submit" />
    </form>
  );
};

export default SignupForm;
