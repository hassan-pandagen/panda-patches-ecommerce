interface ReviewCardProps {
  name: string;
  date: string;
  title?: string;
  body: string;
}

export default function ReviewCard({ name, date, title, body }: ReviewCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
      {title && <p className="font-bold text-gray-900 text-base leading-snug">{title}</p>}
      <p className="text-gray-700 text-sm leading-relaxed">{body}</p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
        <span className="font-semibold text-gray-800 text-sm">{name}</span>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
    </div>
  );
}
