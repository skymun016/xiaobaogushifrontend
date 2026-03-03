import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type RoleTab = 'store' | 'manager';

export default function MobileLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [role, setRole] = useState<RoleTab>('store');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!phone.trim()) {
      toast.error('请输入手机号');
      return;
    }
    if (!/^1\d{10}$/.test(phone.trim())) {
      toast.error('请输入正确的手机号');
      return;
    }
    if (!password) {
      toast.error('请输入密码');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userName = role === 'store' ? '张三' : '管理员';
      login(role, userName);
      toast.success('登录成功');
      navigate(role === 'store' ? '/store' : '/manager');
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-16 pb-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary-foreground)/0.08),transparent_50%)]" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="w-18 h-18 bg-primary-foreground/10 rounded-3xl flex items-center justify-center mx-auto mb-4 w-[72px] h-[72px]">
            <Package className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">小堡故事</h1>
          <p className="text-primary-foreground/50 text-sm mt-1">订货管理系统</p>
        </motion.div>
      </div>

      {/* Role tabs */}
      <div className="px-6 -mt-5 relative z-10">
        <div className="bg-card rounded-2xl shadow-sm p-1.5 flex">
          {([
            { key: 'store' as RoleTab, label: '门店用户' },
            { key: 'manager' as RoleTab, label: '管理员' },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setRole(tab.key)}
              className={cn(
                'flex-1 py-2.5 text-sm font-medium rounded-xl transition-all',
                role === tab.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="flex-1 px-6 pt-8 space-y-5"
      >
        <div className="space-y-2">
          <Label className="text-sm font-medium">手机号</Label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border/50 bg-card"
              maxLength={11}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">密码</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type={showPwd ? 'text' : 'password'}
              placeholder="请输入密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="pl-10 pr-10 h-11 rounded-xl border-border/50 bg-card"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          className="w-full h-12 text-base font-semibold rounded-xl shadow-sm"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? '登录中...' : '登 录'}
        </Button>

        <p className="text-center text-xs text-muted-foreground pt-1">
          {role === 'store' ? '门店账号由管理员分配，如需帮助请联系管理员' : '管理员账号请联系系统管理员获取'}
        </p>
      </motion.div>

      {/* Footer */}
      <div className="px-6 py-6 text-center">
        <p className="text-[11px] text-muted-foreground/60">小堡故事 · 订货管理系统</p>
      </div>
    </div>
  );
}
