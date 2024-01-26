import { Controller, createForm, useForm } from '@softmg/effector-react-form';
import { FC } from 'react';

interface Values {
  userName: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const form = createForm<Values>({
  initialValues: {
    userName: '',
    email: '',
    password: '',
    repeatPassword: '',
  },
  onSubmit: ({ values }) => console.log(values),
});

interface InputProps {
  controller: Controller;
  label: string;
}

const Input: FC<InputProps> = ({ controller, label }) => {
  const { input, isShowError, error } = controller();

  return (
    <div className="input-wrap">
      <label>{label}</label>
      <input
        {...input}
        value={input.value || ''}
        className={'input'}
      />
      {isShowError && <div className="input-error-message">{error}</div>}
    </div>
  );
};

export const Form: FC = () => {
  const { controller, handleSubmit } = useForm({ form: form });
  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        controller={controller({ name: 'userName' })}
      />
      <Input
        label="Name"
        controller={controller({ name: 'email' })}
      />
      <Input
        label="Password"
        controller={controller({ name: 'password' })}
      />
      <Input
        label="Repeat password"
        controller={controller({ name: 'repeatPassword' })}
      />
      <button>submit</button>
    </form>
  );
};
