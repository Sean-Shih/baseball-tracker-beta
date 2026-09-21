interface StatCardProp {
    label: string;
    value: string;
}

export default function StatCard({ label, value }: StatCardProp) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {label}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
                {value}
            </p>
        </div>
    );
}