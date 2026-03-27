"use client";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
