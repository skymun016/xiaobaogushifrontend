import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock login
    await new Promise(r => setTimeout(r, 800));
    login('admin', username);
    setLoading(false);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-2">
            <Package className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl">门店订货管理系统</CardTitle>
          <CardDescription>请登录管理后台</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">用户名</label>
              <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="请输入用户名" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">密码</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="请输入密码" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '登录中...' : '登 录'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              演示账号：admin / 123456
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
