'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { LogIn, UserPlus, Lock, Mail, User as UserIcon, Home, ArrowLeft, Shield, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(loginForm.username, loginForm.password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);

    try {
      await register(registerForm.username, registerForm.email, registerForm.password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-64 h-64 bg-green-500/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Back to Home Button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all duration-300 hover:scale-105 group z-10"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="hidden sm:inline">Quay lại trang chủ</span>
        <Home className="w-4 h-4 sm:hidden" />
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-in slide-in-from-top duration-700">
          <Link href="/" className="inline-block">
            <Image 
              src="/logo (2).png" 
              alt="Football Stats Logo" 
              width={400} 
              height={150} 
              className="h-24 w-auto object-contain mx-auto hover:scale-110 transition-transform duration-300"
            />
          </Link>
          <h1 className="mt-4 text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Football Stats
          </h1>
          <p className="text-slate-400 mt-2">Nền tảng thống kê bóng đá hàng đầu</p>
        </div>

        <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700 shadow-2xl animate-in fade-in slide-in-from-bottom duration-700">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${
                isLoginMode ? 'from-blue-500 to-cyan-500' : 'from-green-500 to-emerald-500'
              } shadow-lg transition-all duration-300`}>
                {isLoginMode ? (
                  <LogIn className="w-8 h-8 text-white" />
                ) : (
                  <UserPlus className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-white">
              {isLoginMode ? 'Đăng nhập' : 'Đăng ký tài khoản'}
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              {isLoginMode 
                ? 'Chào mừng trở lại! Nhập thông tin đăng nhập' 
                : 'Tạo tài khoản mới để trải nghiệm đầy đủ'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/50 text-red-400">
                {error}
              </Alert>
            )}

            {isLoginMode ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-300">
                    Username
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="admin hoặc user"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang đăng nhập...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Đăng nhập
                    </div>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-username" className="text-slate-300">
                    Username
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="reg-username"
                      type="text"
                      placeholder="username"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-slate-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="email@example.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-slate-300">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-confirm-password" className="text-slate-300">
                    Xác nhận mật khẩu
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="reg-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang đăng ký...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Đăng ký
                    </div>
                  )}
                </Button>
              </form>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800 px-2 text-slate-400">hoặc</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-700 hover:scale-105 transition-all duration-300"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
              }}
            >
              {isLoginMode ? (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Chưa có tài khoản? Đăng ký ngay
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Đã có tài khoản? Đăng nhập
                </>
              )}
            </Button>

            {/* Demo accounts info */}
            <div className="mt-4 p-4 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-lg border border-slate-700 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-yellow-400" />
                <p className="text-sm font-semibold text-slate-300">Tài khoản demo</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded">
                  <Shield className="w-4 h-4 text-yellow-400" />
                  <div className="text-xs">
                    <span className="text-yellow-400 font-semibold">Admin: </span>
                    <code className="text-green-400 bg-slate-900/50 px-2 py-0.5 rounded">admin / admin123</code>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded">
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  <div className="text-xs">
                    <span className="text-blue-400 font-semibold">User: </span>
                    <code className="text-green-400 bg-slate-900/50 px-2 py-0.5 rounded">user / user123</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="pt-4 border-t border-slate-700">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-900/30 rounded-lg border border-slate-700/50">
                  <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Real-time</p>
                </div>
                <div className="p-3 bg-slate-900/30 rounded-lg border border-slate-700/50">
                  <Shield className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Bảo mật</p>
                </div>
                <div className="p-3 bg-slate-900/30 rounded-lg border border-slate-700/50">
                  <Home className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Miễn phí</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
