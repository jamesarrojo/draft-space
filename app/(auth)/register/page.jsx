'use client';
import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  async function handleSubmit(
    e,
    email,
    password,
    firstName,
    lastName,
    studentNumber
  ) {
    e.preventDefault();

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          student_number: studentNumber,
          is_admin: false,
          has_table: false,
          is_verified: false,
          points_balance: 0,
        },
      },
    });

    if (error) {
      setError(error.message);
    }

    if (!error) {
      router.push('/');
    }
  }
  return (
    <>
      <h1 className="text-center">Register</h1>
      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            email.trim(),
            password,
            firstName.trim(),
            lastName.trim(),
            studentNumber.trim()
          )
        }
      >
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required={true}
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required={true}
        />
        <Input
          type="text"
          placeholder="Student Number"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
          required={true}
        />

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={true}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        />

        <Button>Submit</Button>
      </form>
      {error && <p>{error}</p>}
    </>
  );
}
