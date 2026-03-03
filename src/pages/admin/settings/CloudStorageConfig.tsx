import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Cloud, Server, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface StorageConfig {
  id: string;
  provider: string;
  is_active: boolean;
  access_key: string;
  secret_key: string;
  bucket: string;
  region: string;
  endpoint: string;
  custom_domain: string;
}

const providerMeta: Record<string, { label: string; color: string; regionPlaceholder: string; endpointPlaceholder: string }> = {
  builtin: { label: '内置存储', color: 'default', regionPlaceholder: '', endpointPlaceholder: '' },
  aliyun: { label: '阿里云 OSS', color: 'default', regionPlaceholder: 'oss-cn-hangzhou', endpointPlaceholder: 'oss-cn-hangzhou.aliyuncs.com' },
  qiniu: { label: '七牛云', color: 'default', regionPlaceholder: 'z0', endpointPlaceholder: 's3-cn-east-1.qiniucs.com' },
  tencent: { label: '腾讯云 COS', color: 'default', regionPlaceholder: 'ap-guangzhou', endpointPlaceholder: 'cos.ap-guangzhou.myqcloud.com' },
};

export default function CloudStorageConfig() {
  const [configs, setConfigs] = useState<StorageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const fetchConfigs = async () => {
    const { data, error } = await supabase.from('cloud_storage_config').select('*').order('provider');
    if (error) {
      toast.error('加载存储配置失败');
      console.error(error);
    } else {
      setConfigs(data as StorageConfig[]);
      // Initialize missing providers
      const existing = new Set(data?.map((d: StorageConfig) => d.provider));
      const missing = ['aliyun', 'qiniu', 'tencent'].filter(p => !existing.has(p));
      if (missing.length > 0) {
        const inserts = missing.map(p => ({ provider: p as 'aliyun' | 'qiniu' | 'tencent', is_active: false }));
        await supabase.from('cloud_storage_config').insert(inserts);
        fetchConfigs();
        return;
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchConfigs(); }, []);

  const handleFieldChange = (id: string, field: keyof StorageConfig, value: string | boolean) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleToggleActive = async (config: StorageConfig) => {
    const newActive = !config.is_active;
    // If activating a third-party, deactivate others
    if (newActive) {
      // Deactivate all others
      const otherIds = configs.filter(c => c.id !== config.id && c.is_active).map(c => c.id);
      if (otherIds.length > 0) {
        await supabase.from('cloud_storage_config').update({ is_active: false }).in('id', otherIds);
      }
    }
    const { error } = await supabase.from('cloud_storage_config').update({ is_active: newActive }).eq('id', config.id);
    if (error) {
      toast.error('切换失败');
    } else {
      toast.success(newActive ? `已启用 ${providerMeta[config.provider]?.label}` : '已停用');
      fetchConfigs();
    }
  };

  const handleSave = async (config: StorageConfig) => {
    setSaving(config.id);
    const { error } = await supabase.from('cloud_storage_config').update({
      access_key: config.access_key,
      secret_key: config.secret_key,
      bucket: config.bucket,
      region: config.region,
      endpoint: config.endpoint,
      custom_domain: config.custom_domain,
    }).eq('id', config.id);
    setSaving(null);
    if (error) {
      toast.error('保存失败：' + error.message);
    } else {
      toast.success('配置已保存');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Cloud className="w-5 h-5 text-primary" />
        <p className="text-sm text-muted-foreground">
          配置第三方云存储服务，用于订单照片等文件存储。启用后将替代内置存储。同一时间仅支持一个存储服务处于启用状态。
        </p>
      </div>

      {configs.map(config => {
        const meta = providerMeta[config.provider] || { label: config.provider, color: 'secondary', regionPlaceholder: '', endpointPlaceholder: '' };
        const isBuiltin = config.provider === 'builtin';
        const showSecret = showSecrets[config.id];

        return (
          <Card key={config.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isBuiltin ? <Server className="w-5 h-5 text-muted-foreground" /> : <Cloud className="w-5 h-5 text-primary" />}
                  <CardTitle className="text-base">{meta.label}</CardTitle>
                  {config.is_active && <Badge>启用中</Badge>}
                </div>
                <Switch checked={config.is_active} onCheckedChange={() => handleToggleActive(config)} />
              </div>
            </CardHeader>
            {!isBuiltin && (
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Access Key</Label>
                    <Input
                      value={config.access_key}
                      onChange={e => handleFieldChange(config.id, 'access_key', e.target.value)}
                      placeholder="请输入 Access Key"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Secret Key</Label>
                    <div className="relative">
                      <Input
                        type={showSecret ? 'text' : 'password'}
                        value={config.secret_key}
                        onChange={e => handleFieldChange(config.id, 'secret_key', e.target.value)}
                        placeholder="请输入 Secret Key"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecrets(prev => ({ ...prev, [config.id]: !prev[config.id] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Bucket</Label>
                    <Input
                      value={config.bucket}
                      onChange={e => handleFieldChange(config.id, 'bucket', e.target.value)}
                      placeholder="请输入 Bucket 名称"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Input
                      value={config.region}
                      onChange={e => handleFieldChange(config.id, 'region', e.target.value)}
                      placeholder={meta.regionPlaceholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Endpoint</Label>
                    <Input
                      value={config.endpoint}
                      onChange={e => handleFieldChange(config.id, 'endpoint', e.target.value)}
                      placeholder={meta.endpointPlaceholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>自定义域名（可选）</Label>
                    <Input
                      value={config.custom_domain}
                      onChange={e => handleFieldChange(config.id, 'custom_domain', e.target.value)}
                      placeholder="https://cdn.example.com"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => handleSave(config)} disabled={saving === config.id} size="sm">
                    {saving === config.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                    保存配置
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
