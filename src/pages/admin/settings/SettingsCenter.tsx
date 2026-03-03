import { useState } from 'react';
import { formatDateWithDay } from '@/lib/utils';
import { mockSystemUsers, mockSystemRoles, mockAuditLogs } from '@/mock/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Settings, Users, Shield, ClipboardList, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsCenter() {
  const [tab, setTab] = useState('users');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">系统设置</h1>
        <p className="text-muted-foreground">用户管理、角色权限、参数配置、审计日志</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="users">用户管理</TabsTrigger>
          <TabsTrigger value="roles">角色权限</TabsTrigger>
          <TabsTrigger value="config">参数配置</TabsTrigger>
          <TabsTrigger value="audit">审计日志</TabsTrigger>
        </TabsList>

        {/* Users */}
        <TabsContent value="users" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowAddUser(true)}><Plus className="w-4 h-4 mr-1" />新增用户</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户名</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>手机号</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>最近登录</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSystemUsers.map(u => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.username}</TableCell>
                      <TableCell>{u.realName}</TableCell>
                      <TableCell><Badge variant="secondary">{u.role}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{u.phone}</TableCell>
                      <TableCell>
                        <Badge variant={u.status === 'active' ? 'default' : 'destructive'}>
                          {u.status === 'active' ? '正常' : '禁用'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{u.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">编辑</Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => toast.success('已重置密码')}>重置密码</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles */}
        <TabsContent value="roles" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowAddRole(true)}><Plus className="w-4 h-4 mr-1" />新增角色</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {mockSystemRoles.map(r => (
              <Card key={r.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <h3 className="font-medium">{r.name}</h3>
                    </div>
                    <Badge variant="outline">{r.userCount} 人</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{r.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {r.permissions.map(p => (
                      <Badge key={p} variant="secondary" className="text-xs">{p === 'all' ? '全部权限' : p}</Badge>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="ghost" size="sm">编辑</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Config */}
        <TabsContent value="config" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">订单参数</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: '下单时间', value: '周一至周五 00:00-23:59', desc: '仅在此时段可正式下单' },
                { label: '统一发货日', value: '周六', desc: '节假日顺延至下一个工作日' },
                { label: '安全库存阈值', value: '80', desc: '低于此数量触发库存预警' },
              ].map(c => (
                <div key={c.label} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{c.value}</span>
                    <Button variant="ghost" size="sm">修改</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">系统开关</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: '申请订货功能', desc: '非下单时段允许提交申请订货', on: true },
                { label: '库存预警通知', desc: '库存低于安全线时自动通知', on: true },
                { label: '采购异常通知', desc: '采购异常时短信通知管理员', on: true },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <Switch defaultChecked={s.on} onCheckedChange={(v) => toast.success(v ? '已开启' : '已关闭')} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit */}
        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>操作人</TableHead>
                    <TableHead>操作</TableHead>
                    <TableHead>操作对象</TableHead>
                    <TableHead>详情</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAuditLogs.map(l => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">{l.operator}</TableCell>
                      <TableCell><Badge variant="secondary">{l.action}</Badge></TableCell>
                      <TableCell>{l.target}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-xs truncate">{l.detail}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">{l.ip}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDateWithDay(l.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent>
          <DialogHeader><DialogTitle>新增用户</DialogTitle><DialogDescription>填写用户信息</DialogDescription></DialogHeader>
          <div className="space-y-4">
            {[{ l: '用户名', p: '请输入用户名' }, { l: '姓名', p: '请输入姓名' }, { l: '手机号', p: '请输入手机号' }].map(f => (
              <div key={f.l} className="space-y-2"><label className="text-sm font-medium">{f.l}</label><Input placeholder={f.p} /></div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUser(false)}>取消</Button>
            <Button onClick={() => { toast.success('用户已添加'); setShowAddUser(false); }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={showAddRole} onOpenChange={setShowAddRole}>
        <DialogContent>
          <DialogHeader><DialogTitle>新增角色</DialogTitle><DialogDescription>配置角色信息和权限</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium">角色名称</label><Input placeholder="请输入角色名称" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">描述</label><Input placeholder="角色描述" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRole(false)}>取消</Button>
            <Button onClick={() => { toast.success('角色已添加'); setShowAddRole(false); }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
