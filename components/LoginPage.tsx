import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    
    try {
        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name }
                }
            });
            if (error) throw error;
            // For email confirmation flows, you might want to show a message here
            if (!error) {
               // Auto login works if email confirmation is disabled in Supabase, 
               // otherwise user needs to check email.
               // For this demo, we assume success triggers session change in App.tsx
            }
        }
        // onLogin is handled by the onAuthStateChange listener in App.tsx generally,
        // but we can call it here for immediate feedback if needed.
    } catch (err: any) {
        setErrorMsg(err.message || "Authentication failed");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-dark-900 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Left Side - Visual / Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1558002038-109177381792?auto=format&fit=crop&w=1600&q=80" 
          alt="Smart Home" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 animate-in fade-in duration-1000"
        />
        
        <div className="relative z-20 flex flex-col justify-between p-16 h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SmartHome Pro</span>
          </div>

          <div className="max-w-md space-y-6">
            <h1 className="text-5xl font-bold text-white leading-tight">
              未来的生活，<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">触手可及。</span>
            </h1>
            <p className="text-lg text-slate-400">
              全方位智能家居控制中心。实时监控、AI 智能分析、能源管理，为您打造安全、舒适、高效的居住环境。
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>© 2023 SmartHome Inc.</span>
            <div className="w-1 h-1 bg-slate-600 rounded-full" />
            <span>Privacy Policy</span>
            <div className="w-1 h-1 bg-slate-600 rounded-full" />
            <span>Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md space-y-8 relative z-10 animate-in slide-in-from-right-8 duration-500 fade-in">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">
              {isLogin ? '欢迎回来' : '创建账户'}
            </h2>
            <p className="text-slate-400">
              {isLogin ? '请输入您的详细信息以登录' : '开始您的智能生活体验'}
            </p>
          </div>

          {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-400 text-sm">
                  <AlertTriangle size={18} />
                  {errorMsg}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {!isLogin && (
              <div className="space-y-1.5 animate-in slide-in-from-top-4 fade-in duration-300">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">全名</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="您的名字"
                    className="block w-full pl-11 pr-4 py-3 bg-dark-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">电子邮箱</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-11 pr-4 py-3 bg-dark-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">密码</label>
                {isLogin && (
                  <button type="button" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                    忘记密码？
                  </button>
                )}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-11 py-3 bg-dark-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? '登录' : '注册账户'} <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            {isLogin ? '还没有账户？' : '已有账户？'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-blue-500 hover:text-blue-400 font-medium transition-colors"
            >
              {isLogin ? '立即注册' : '直接登录'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};