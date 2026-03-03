import { useState } from 'react';
import { mockNotificationTemplates, mockNotificationLogs } from '@/mock/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationCenter() {
  const [tab, setTab] = useState('templates');
  const [showAdd, setShowAdd] = useState(false);

  const channelLabel = (ch: string) => ch === 'wechat' ? '微信' : ch === 'sms' ? '短信' : '邮件';
  const typeLabel = (t: string) => ({ order: '订单', procurement: '采购', fulfillment: '履约', system: '系统' }[t] || t);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">通知系统</h1>
        <p className="text-muted-foreground">通知模板管理和发送日志</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="templates">通知模板</TabsTrigger>
          <TabsTrigger value="logs">通知日志</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 mr-1" />新增模板</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>模板名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>渠道</TableHead>
                    <TableHead>内容</TableHead>
                    <TableHead>启用</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockNotificationTemplates.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell><Badge variant="secondary">{typeLabel(t.type)}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{channelLabel(t.channel)}</Badge></TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground text-sm">{t.content}</TableCell>
                      <TableCell><Switch defaultChecked={t.enabled} onCheckedChange={(v) => toast.success(v ? '已启用' : '已禁用')} /></TableCell>
                      <TableCell><Button variant="ghost" size="sm">编辑</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>模板</TableHead>
                    <TableHead>接收方</TableHead>
                    <TableHead>渠道</TableHead>
                    <TableHead>内容</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>发送时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockNotificationLogs.map(l => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">{l.templateName}</TableCell>
                      <TableCell>{l.target}</TableCell>
                      <TableCell><Badge variant="outline">{channelLabel(l.channel)}</Badge></TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground text-sm">{l.content}</TableCell>
                      <TableCell>
                        <Badge variant={l.status === 'sent' ? 'default' : 'destructive'}>
                          {l.status === 'sent' ? '已发送' : '失败'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{l.sentAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增通知模板</DialogTitle>
            <DialogDescription>配置通知模板信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium">模板名称</label><Input placeholder="例: 发货通知" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">通知内容</label><Textarea placeholder="使用 {变量名} 插入动态内容" rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>取消</Button>
            <Button onClick={() => { toast.success('模板已添加'); setShowAdd(false); }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
