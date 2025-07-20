'use client';
import React from 'react';
import { useLogin } from '../hooks/useLogin';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Mail, Lock, Users, AlertCircle } from 'lucide-react';

export default function EmployeeLoginForm() {
  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    loading,
    error,
    loginWithCredentials,
  } = useLogin('employee');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithCredentials();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Nhân Viên</h1>
          <p className="text-gray-600 text-sm">Đăng nhập vào hệ thống</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email đăng nhập
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="pl-10"
                disabled={loading}
                placeholder="your.email@company.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={loading}
                placeholder="Nhập mật khẩu"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !identifier.trim() || !password.trim()}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Cần hỗ trợ?</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <Button
              variant="ghost"
              className="text-sm text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Quên mật khẩu?
            </Button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Lưu ý cho nhân viên:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Email đăng nhập do chủ sở hữu cung cấp</li>
                <li>• Mật khẩu được gửi qua email khi tài khoản được tạo</li>
                <li>• Liên hệ quản lý nếu chưa nhận được thông tin đăng nhập</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Bằng việc đăng nhập, bạn đồng ý với điều khoản sử dụng
          </p>
        </div>
      </div>
    </div>
  );
}