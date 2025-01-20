'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './page.module.css';
import { isValidCPF } from './validateCpf';

interface FormData {
  nomeCompleto: string;
  cpf: string;
  email: string;
  corPreferida: 'vermelho' | 'laranja' | 'amarelo' | 'verde' | 'azul' | 'anil' | 'violeta';
  observacao?: string;
}

const formSchema = yup.object().shape({
  nomeCompleto: yup.string().required('Nome Completo é obrigatório'),
  cpf: yup.string()
  .required('CPF é obrigatório')
  .test('cpf', 'CPF inválido', value => value ? isValidCPF(value) : false),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  corPreferida: yup.string().oneOf(
    ['vermelho', 'laranja', 'amarelo', 'verde', 'azul', 'anil', 'violeta']
  ).required('Cor Preferida é obrigatória'),
  observacao: yup.string(),
});

const FormPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(result.message);
        reset();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage(`Ocorreu um erro ao enviar o formulário. Tente novamente mais tarde. ${
        (error as {message: string}).message
      }`);
    }

    setIsSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <h1>Formulário</h1>
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="nomeCompleto">Nome Completo</label>
          <input id="nomeCompleto" {...register('nomeCompleto')} />
          {errors.nomeCompleto && <p className={styles.error}>{errors.nomeCompleto.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            {...register('cpf')}
            placeholder="xxx.xxx.xxx-xx"
            maxLength={14}
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                .slice(0, 14))
            }
          />
          {errors.cpf && <p className={styles.error}>{errors.cpf.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="email">E-mail</label>
          <input id="email" {...register('email')} />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="corPreferida">Cor Preferida</label>
          <select id="corPreferida" {...register('corPreferida')}>
            <option value="vermelho">Vermelho</option>
            <option value="laranja">Laranja</option>
            <option value="amarelo">Amarelo</option>
            <option value="verde">Verde</option>
            <option value="azul">Azul</option>
            <option value="anil">Anil</option>
            <option value="violeta">Violeta</option>
          </select>
          {errors.corPreferida && <p className={styles.error}>{errors.corPreferida.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="observacao">Observação</label>
          <textarea id="observacao" {...register('observacao')} />
          {errors.observacao && <p className={styles.error}>{errors.observacao.message}</p>}
        </div>

        <button 
          type="submit" 
          className={styles.button} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};

export default FormPage;
