import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Monitor, Smartphone } from 'lucide-react';

export default function EntryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">小堡故事订货管理系统</h1>
          <p className="text-muted-foreground mt-1">请选择要进入的端口</p>
        </div>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/login')}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Monitor className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">管理后台</h3>
              <p className="text-sm text-muted-foreground">商品管理、订单处理、采购管理、财务报表</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/mobile/login')}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-status-success/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-status-success" />
            </div>
            <div>
              <h3 className="font-semibold">门店订货端</h3>
              <p className="text-sm text-muted-foreground">浏览商品、下单订货、查看订单</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/mobile/login')}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-status-pending/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-status-pending" />
            </div>
            <div>
              <h3 className="font-semibold">管理移动端</h3>
              <p className="text-sm text-muted-foreground">审核申请、订单协同、异常上报</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
