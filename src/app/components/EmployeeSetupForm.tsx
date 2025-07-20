// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Input } from '@/app/components/ui/input';
// import { Button } from '@/app/components/ui/button';
// import employeeService from '../../services/seedMail';
// import { toast } from 'react-toastify';

// interface EmployeeSetupFormProps {
//   onBack?: () => void;
// }

// export default function EmployeeSetupForm({ onBack }: EmployeeSetupFormProps) {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [tokenValid, setTokenValid] = useState(false);
//   const [validating, setValidating] = useState(true);
//   const [employee, setEmployee] = useState<{ email: string; fullName: string } | null>(null);

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get('token');

//   useEffect(() => {
//     const validate = async () => {
//       if (!token) {
//         setError('Thiếu token');
//         setValidating(false);
//         return;
//       }

//       try {
//         const res = await employeeService.validateSetupToken(token);
//         if (res.data.success && res.data.isValid) {
//           setTokenValid(true);
//           setEmployee({ email: res.data.email, fullName: res.data.fullName });
//         } else {
//           setError(res.data.message || 'Token không hợp lệ');
//         }
//       } catch {
//         setError('Lỗi xác thực token');
//       } finally {
//         setValidating(false);
//       }
//     };

//     validate();
//   }, [token]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       setError('Mật khẩu không khớp');
//       return;
//     }
//     if (password.length < 8) {
//       setError('Mật khẩu cần ít nhất 8 ký tự');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const res = await employeeService.setupEmployeePassword(token!, password);
//       if (res.data.success) {
//         toast.success('Thiết lập thành công');
//         localStorage.setItem('token', res.data.token);
//         localStorage.setItem('email', employee?.email || '');
//         localStorage.setItem('userRole', 'employee');
//         router.push('/employee-dashboard');
//       } else {
//         setError(res.data.message || 'Thiết lập thất bại');
//       }
//     } catch {
//       setError('Lỗi kết nối');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (validating) {
//     return <div className="min-h-screen flex items-center justify-center">Đang xác thực...</div>;
//   }

//   if (!tokenValid) {
//     return (
//       <div className="min-h-screen flex items-center justify-center flex-col space-y-4">
//         <p className="text-red-600">{error}</p>
//         <Button onClick={() => router.push('/login')}>Quay lại đăng nhập</Button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div className="w-full max-w-sm space-y-6">
//         <h2 className="text-xl font-semibold text-center">Thiết lập mật khẩu</h2>
//         <p className="text-sm text-center text-gray-600">{employee?.email}</p>

//         {error && <p className="text-sm text-red-600">{error}</p>}

//         {onBack && (
//           <Button variant="outline" onClick={onBack} className="w-full">
//             ← Quay lại
//           </Button>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             type="password"
//             placeholder="Mật khẩu mới"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             disabled={loading}
//             required
//           />
//           <Input
//             type="password"
//             placeholder="Xác nhận mật khẩu"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             disabled={loading}
//             required
//           />
//           <Button type="submit" disabled={loading}>
//             {loading ? 'Đang xử lý...' : 'Xác nhận'}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }
