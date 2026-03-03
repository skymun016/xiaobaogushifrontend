import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-sm w-full">
        <CardContent className="p-8 text-center">
          <Construction className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-1">{title}</h2>
          <p className="text-sm text-muted-foreground">{description || '该模块正在开发中，敬请期待'}</p>
        </CardContent>
      </Card>
    </div>
  );
}
