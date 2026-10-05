import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const chartStyle = { border: '1px solid #e8e8df', borderRadius: 8, fontSize: 10 }
const axisStyle = { fill: '#9ba198', fontSize: 8 }

export function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 2, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="investmentFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e87948" stopOpacity=".18" /><stop offset="100%" stopColor="#e87948" stopOpacity="0" /></linearGradient>
          <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#65a876" stopOpacity=".15" /><stop offset="100%" stopColor="#65a876" stopOpacity="0" /></linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#edf0e9" strokeDasharray="3 5" />
        <XAxis dataKey="month" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={chartStyle} />
        <Area type="monotone" dataKey="balance" name="Investments" stroke="#e87948" strokeWidth={2.5} fill="url(#investmentFill)" />
        <Area type="monotone" dataKey="savings" name="Savings" stroke="#65a876" strokeWidth={2} fill="url(#savingsFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function SpendingDonut({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="68%" outerRadius="96%" paddingAngle={2} stroke="none">
          {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
        </Pie>
        <Tooltip contentStyle={chartStyle} formatter={(value) => [`${value}%`, 'Spending']} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function CashflowChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }} barGap={4}>
        <CartesianGrid vertical={false} stroke="#edf0e9" strokeDasharray="3 5" />
        <XAxis dataKey="month" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={chartStyle} />
        <Bar dataKey="income" name="Income" fill="#65a876" radius={[3, 3, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill="#e87948" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
