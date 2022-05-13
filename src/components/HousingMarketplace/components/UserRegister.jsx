import React, { useContext, useState } from 'react';
import $ from 'jquery';
import styled from 'styled-components';
import { Button, Typography } from '@mui/material';
import { DynamicFormInputs } from '../../DynamicFormInputs/DynamicFormInputs';
import { UserAuthenticationContext } from '../context/UserAuthenticationContext';
import { AlertContext } from '../../Alert/context/AlertContext';
import { USER_REGISTER_INPUTS } from '../constants/USER_REGISTER_INPUTS';

export const UserRegister = () => {
  const { userAuthenticationDispatch } = useContext(UserAuthenticationContext);
  const { alertDispatch } = useContext(AlertContext);
  const [userItem, setUserItem] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const allFieldsFilled =
    userItem.firstName &&
    userItem.lastName &&
    userItem.email &&
    userItem.username &&
    userItem.password &&
    userItem.confirmPassword;

  const handleAlert = (msg, title, type) => {
    alertDispatch({
      type: 'SET_ALERT',
      fadeOut: false,
      payload: { msg: msg, title: title, type: type },
    });

    setTimeout(() => alertDispatch({ type: 'FADE_ALERT', fadeOut: true }), 2000);
    setTimeout(() => alertDispatch({ type: 'REMOVE_ALERT' }), 2400);
  };

  const handleUserItemChange = e => {
    const itemID = e.currentTarget.id;
    const itemValue = e.currentTarget.value;

    setUserItem({ ...userItem, [itemID]: itemValue });
  };

  const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const validateUserItem = async userItem => {
    const { email, username, password, confirmPassword } = userItem;

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    } else if (!validateEmail(email)) {
      return 'Email entered is not valid';
    } else {
      const response = await fetch(`../checkForUser/${email}/${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).catch(e => console.warn(e));

      if (response.ok) {
        const { msg } = await response.json();

        if (msg) {
          return msg;
        }
      }
    }

    return null;
  };

  const addUserItem = async userItem => {
    const response = await fetch('../addUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userItem),
    }).catch(e => console.warn(e));

    if (!response.ok) {
      console.warn(Promise.reject(response));
    } else {
      const { email } = await response.json();

      const msg = `An account has been created under the email of ${email}`;

      userAuthenticationDispatch({ type: 'SIGN_IN' });
      handleAlert(msg, 'Successful sign-up', 'success');
    }
  };

  const handleSubmit = async () => {
    const validationMsg = await validateUserItem(userItem);

    if (validationMsg) {
      handleAlert(validationMsg, 'Sign-up error', 'error');
    } else {
      const { firstName, lastName, email, username, password } = userItem;

      addUserItem({
        firstName: firstName,
        lastName: lastName,
        email: email,
        userName: username,
        password: password,
      });
    }
  };

  return (
    <>
      <RegisterText component='h4' variant='h4'>
        Sign up
      </RegisterText>
      <RegisterText component='p' variant='p'>
        Fill in all information below to sign up today!
      </RegisterText>
      <DynamicFormInputs inputs={USER_REGISTER_INPUTS} onChange={handleUserItemChange} />
      <ButtonContainer>
        <Button disabled={!allFieldsFilled} color='info' fullWidth onClick={handleSubmit} variant='contained'>
          Submit
        </Button>
      </ButtonContainer>
    </>
  );
};

const RegisterText = styled(Typography)({
  margin: '10px 0',
});

const ButtonContainer = styled.div({
  margin: 10,
});
