import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function InitialSetup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [realName, setRealName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin already exists
    supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('role', 'admin')
      .then(({ count }) => {
        setHasAdmin((count ?? 0) > 0);
        setChecking(false);
      });
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('请填写邮箱和密码');
      return;
    }
    if (password.length < 6) {
      toast.error('密码至少6位');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.functions.invoke('create-user', {
      body: { email: email.trim(), password, real_name: realName, phone, role: 'admin' },
    });
    setLoading(false);

    if (error || data?.error) {
      toast.error('创建失败：' + (data?.error || error?.message));
      return;
    }

    toast.success('管理员账号创建成功，请登录');
    navigate('/admin/login');
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-2">
            <Package className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl">系统初始化</CardTitle>
          <CardDescription>创建初始管理员账号</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">邮箱（登录账号）</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" type="email" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">密码</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="至少6位" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">姓名</label>
              <Input value={realName} onChange={e => setRealName(e.target.value)} placeholder="管理员姓名" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">手机号</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="手机号（可选）" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '创建中...' : '创建管理员账号'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
