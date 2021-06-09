import React, { useContext } from 'react';

const FormContext = React.createContext({});

const FormProvider = FormContext.Provider;

const useFormContext = () => useContext(FormContext);

export { FormContext, FormProvider, useFormContext };
