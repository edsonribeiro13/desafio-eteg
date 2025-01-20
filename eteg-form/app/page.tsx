'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './page.module.css';
import { isValidCPF } from './validateCpf';

// Validation Schema
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true)
    
    const successMessage = document.createElement('div');
    successMessage.textContent = 'Formulário enviado com sucesso!';
    successMessage.style.position = 'fixed';
    successMessage.style.top = '20px';
    successMessage.style.left = '50%';
    successMessage.style.transform = 'translateX(-50%)';
    successMessage.style.backgroundColor = '#d4edda';
    successMessage.style.color = '#155724';
    successMessage.style.padding = '10px 20px';
    successMessage.style.border = '1px solid #c3e6cb';
    successMessage.style.borderRadius = '5px';
    successMessage.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    successMessage.style.fontSize = '16px';
    successMessage.style.zIndex = '1000';

    document.body.appendChild(successMessage);

    setIsSubmitting(false)

    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000);

    console.log('Submitted Data:', data);
  };

  return (
    <div className={styles.container}>
      <h1>Formulário</h1>
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

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};

export default FormPage;
