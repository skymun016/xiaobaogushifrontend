import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Smartphone, Key, Layout, Upload, MessageSquare, Eye, EyeOff, Copy, Plus, Trash2, Edit, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDateWithDay } from '@/lib/utils';

// Mock data
const mockConfig = {
  appId: 'wx1234567890abcdef',
  appSecret: '••••••••••••••••••••••••••••••••',
  mchId: '1234567890',
  mchKey: '••••••••••••••••••••••••••••••••',
  notifyUrl: 'https://api.example.com/wechat/notify',
  serverDomain: 'https://api.example.com',
  wssDomain: 'wss://ws.example.com',
  uploadDomain: 'https://upload.example.com',
};

const mockPages = [
  { id: 'pg1', path: '/pages/home/index', name: '首页', isTabBar: true, sort: 1 },
  { id: 'pg2', path: '/pages/category/index', name: '分类', isTabBar: true, sort: 2 },
  { id: 'pg3', path: '/pages/cart/index', name: '购物车', isTabBar: true, sort: 3 },
  { id: 'pg4', path: '/pages/profile/index', name: '我的', isTabBar: true, sort: 4 },
  { id: 'pg5', path: '/pages/product/detail', name: '商品详情', isTabBar: false, sort: 5 },
  { id: 'pg6', path: '/pages/order/list', name: '订单列表', isTabBar: false, sort: 6 },
  { id: 'pg7', path: '/pages/order/detail', name: '订单详情', isTabBar: false, sort: 7 },
  { id: 'pg8', path: '/pages/order/apply', name: '申请订货', isTabBar: false, sort: 8 },
];

const mockVersions = [
  { id: 'v1', version: '1.3.0', status: 'online' as const, description: '新增申请订货功能，优化购物车体验', publishedAt: '2026-02-20 10:00:00', operator: '管理员' },
  { id: 'v2', version: '1.2.1', status: 'archived' as const, description: '修复支付回调异常问题', publishedAt: '2026-02-10 14:30:00', operator: '管理员' },
  { id: 'v3', version: '1.2.0', status: 'archived' as const, description: '新增配送跟踪功能', publishedAt: '2026-01-15 09:00:00', operator: '管理员' },
  { id: 'v4', version: '1.4.0', status: 'auditing' as const, description: '新增消息通知中心，优化下单流程', publishedAt: '', operator: '管理员' },
  { id: 'v5', version: '1.4.1', status: 'developing' as const, description: '修复已知问题，性能优化', publishedAt: '', operator: '' },
];

const mockTemplates = [
  { id: 'tpl1', templateId: 'tmpl_order_paid', name: '订单支付成功通知', enabled: true, keywords: ['订单编号', '支付金额', '支付时间'], scene: '用户支付成功后推送' },
  { id: 'tpl2', templateId: 'tmpl_order_shipped', name: '订单发货通知', enabled: true, keywords: ['订单编号', '物流公司', '发货时间'], scene: '订单发货后推送' },
  { id: 'tpl3', templateId: 'tmpl_order_received', name: '订单签收通知', enabled: true, keywords: ['订单编号', '签收时间'], scene: '门店签收后推送' },
  { id: 'tpl4', templateId: 'tmpl_audit_result', name: '申请审核结果通知', enabled: false, keywords: ['申请编号', '审核结果', '审核时间'], scene: '申请订货审核完成后推送' },
  { id: 'tpl5', templateId: 'tmpl_stock_alert', name: '库存预警通知', enabled: false, keywords: ['商品名称', '当前库存', '预警阈值'], scene: '库存低于阈值时推送' },
];

const versionStatusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  online: { label: '线上版本', variant: 'default' },
  auditing: { label: '审核中', variant: 'secondary' },
  developing: { label: '开发中', variant: 'outline' },
  archived: { label: '已归档', variant: 'secondary' },
};

export default function MiniProgramCenter() {
  const [tab, setTab] = useState('config');
  const [showSecret, setShowSecret] = useState(false);
  const [showMchKey, setShowMchKey] = useState(false);
  const [editPage, setEditPage] = useState<string | null>(null);
  const [templates, setTemplates] = useState(mockTemplates);
  const [editTemplateId, setEditTemplateId] = useState<string | null>(null);
  const [editTemplateValue, setEditTemplateValue] = useState('');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`已复制${label}`);
  };

  const toggleTemplate = (id: string) => {
    setTemplates(prev =>
      prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t)
    );
    const tpl = templates.find(t => t.id === id);
    if (tpl) {
      toast.success(tpl.enabled ? `已关闭「${tpl.name}」` : `已启用「${tpl.name}」`);
    }
  };

  const openEditTemplate = (id: string) => {
    const tpl = templates.find(t => t.id === id);
    if (tpl) {
      setEditTemplateId(id);
      setEditTemplateValue(tpl.templateId);
    }
  };

  const saveTemplateId = () => {
    if (!editTemplateId) return;
    setTemplates(prev =>
      prev.map(t => t.id === editTemplateId ? { ...t, templateId: editTemplateValue } : t)
    );
    toast.success('模板ID已更新');
    setEditTemplateId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">小程序管理</h1>
        <p className="text-muted-foreground">管理微信小程序配置、页面路径、版本发布和消息模板</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="config" className="gap-1.5">
            <Key className="w-3.5 h-3.5" />
            基础配置
          </TabsTrigger>
          <TabsTrigger value="pages" className="gap-1.5">
            <Layout className="w-3.5 h-3.5" />
            页面管理
          </TabsTrigger>
          <TabsTrigger value="versions" className="gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            版本发布
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            消息模板
          </TabsTrigger>
        </TabsList>

        {/* ====== 基础配置 ====== */}
        <TabsContent value="config" className="mt-4 space-y-4">
          {/* 小程序参数 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> 小程序参数
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>AppID</Label>
                  <div className="flex gap-2">
                    <Input value={mockConfig.appId} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="icon" onClick={() => handleCopy(mockConfig.appId, 'AppID')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>AppSecret</Label>
                  <div className="flex gap-2">
                    <Input
                      value={showSecret ? 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6' : mockConfig.appSecret}
                      readOnly
                      type={showSecret ? 'text' : 'password'}
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="icon" onClick={() => setShowSecret(!showSecret)}>
                      {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 支付配置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="w-4 h-4" /> 微信支付配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>商户号（MchID）</Label>
                  <Input value={mockConfig.mchId} readOnly className="font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <Label>商户密钥（MchKey）</Label>
                  <div className="flex gap-2">
                    <Input
                      value={showMchKey ? 'mch_secret_key_1234567890abcdef' : mockConfig.mchKey}
                      readOnly
                      type={showMchKey ? 'text' : 'password'}
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="icon" onClick={() => setShowMchKey(!showMchKey)}>
                      {showMchKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>支付回调地址</Label>
                <div className="flex gap-2">
                  <Input value={mockConfig.notifyUrl} readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="icon" onClick={() => handleCopy(mockConfig.notifyUrl, '回调地址')}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 服务器域名 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">服务器域名配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>request 合法域名</Label>
                  <Input value={mockConfig.serverDomain} readOnly className="font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <Label>socket 合法域名</Label>
                  <Input value={mockConfig.wssDomain} readOnly className="font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <Label>uploadFile 合法域名</Label>
                  <Input value={mockConfig.uploadDomain} readOnly className="font-mono text-sm" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => toast.success('配置已保存')}>保存配置</Button>
          </div>
        </TabsContent>

        {/* ====== 页面管理 ====== */}
        <TabsContent value="pages" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">页面路径配置</CardTitle>
              <Button size="sm" onClick={() => toast.info('添加页面功能开发中')}>
                <Plus className="w-4 h-4 mr-1" /> 添加页面
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>页面名称</TableHead>
                    <TableHead>路径</TableHead>
                    <TableHead>TabBar</TableHead>
                    <TableHead>排序</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPages.map(page => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{page.path}</TableCell>
                      <TableCell>
                        {page.isTabBar ? (
                          <Badge variant="default">TabBar</Badge>
                        ) : (
                          <Badge variant="outline">子页面</Badge>
                        )}
                      </TableCell>
                      <TableCell>{page.sort}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setEditPage(page.id)}>
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => toast.info('删除功能开发中')}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====== 版本发布 ====== */}
        <TabsContent value="versions" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => toast.info('提交新版本功能开发中')}>
              <Upload className="w-4 h-4 mr-1" /> 提交新版本
            </Button>
          </div>

          <div className="space-y-3">
            {mockVersions.map(v => (
              <Card key={v.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        v.status === 'online' ? 'bg-primary/10 text-primary'
                          : v.status === 'auditing' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                          : v.status === 'developing' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {v.status === 'online' ? <CheckCircle className="w-5 h-5" />
                          : v.status === 'auditing' ? <Clock className="w-5 h-5" />
                          : v.status === 'developing' ? <Edit className="w-5 h-5" />
                          : <Upload className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">v{v.version}</span>
                          <Badge variant={versionStatusMap[v.status].variant}>
                            {versionStatusMap[v.status].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{v.description}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {v.publishedAt ? (
                        <>
                          <p>{formatDateWithDay(v.publishedAt)}</p>
                          <p className="text-xs">{v.operator}</p>
                        </>
                      ) : (
                        <p className="text-xs">未发布</p>
                      )}
                    </div>
                  </div>
                  {v.status === 'auditing' && (
                    <div className="mt-3 flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => toast.info('撤回审核功能开发中')}>撤回审核</Button>
                    </div>
                  )}
                  {v.status === 'developing' && (
                    <div className="mt-3 flex gap-2 justify-end">
                      <Button size="sm" onClick={() => toast.info('提交审核功能开发中')}>提交审核</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ====== 消息模板 ====== */}
        <TabsContent value="templates" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">订阅消息模板</CardTitle>
              <Button size="sm" variant="outline" onClick={() => toast.info('同步模板功能开发中')}>
                同步模板
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>模板名称</TableHead>
                    <TableHead>模板ID</TableHead>
                    <TableHead>关键词</TableHead>
                    <TableHead>使用场景</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map(tpl => (
                    <TableRow key={tpl.id}>
                      <TableCell className="font-medium">{tpl.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs text-muted-foreground">{tpl.templateId}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => openEditTemplate(tpl.id)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {tpl.keywords.map(kw => (
                            <Badge key={kw} variant="outline" className="text-xs">{kw}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs">{tpl.scene}</TableCell>
                      <TableCell>
                        <Switch checked={tpl.enabled} onCheckedChange={() => toggleTemplate(tpl.id)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> 注意事项
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
                <li>消息模板需在微信公众平台申请后，将模板ID填入系统</li>
                <li>用户需在小程序内主动订阅消息后，才能收到推送通知</li>
                <li>每条模板消息的推送频率受微信平台限制</li>
                <li>关闭模板后，对应场景将不再推送消息给用户</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit page dialog */}
      <Dialog open={!!editPage} onOpenChange={() => setEditPage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑页面配置</DialogTitle>
            <DialogDescription>修改小程序页面路径和属性</DialogDescription>
          </DialogHeader>
          {editPage && (() => {
            const page = mockPages.find(p => p.id === editPage);
            if (!page) return null;
            return (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>页面名称</Label>
                  <Input defaultValue={page.name} />
                </div>
                <div className="space-y-2">
                  <Label>页面路径</Label>
                  <Input defaultValue={page.path} className="font-mono text-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked={page.isTabBar} id="tabbar" />
                  <Label htmlFor="tabbar">设为 TabBar 页面</Label>
                </div>
                <div className="space-y-2">
                  <Label>排序</Label>
                  <Input type="number" defaultValue={page.sort} className="w-24" />
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPage(null)}>取消</Button>
            <Button onClick={() => { toast.success('页面配置已保存'); setEditPage(null); }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit template ID dialog */}
      <Dialog open={!!editTemplateId} onOpenChange={() => setEditTemplateId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改模板ID</DialogTitle>
            <DialogDescription>
              {editTemplateId && templates.find(t => t.id === editTemplateId)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>模板ID</Label>
            <Input
              value={editTemplateValue}
              onChange={e => setEditTemplateValue(e.target.value)}
              placeholder="请输入微信模板ID"
              className="font-mono text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTemplateId(null)}>取消</Button>
            <Button onClick={saveTemplateId}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
