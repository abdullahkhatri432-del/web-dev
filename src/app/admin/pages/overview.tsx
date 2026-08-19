import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Building, Calendar, Sun } from "lucide-react"

export default function AdminOverviewPage() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Total Revenue Card */}
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div>
                <p className="text-3xl font-bold text-accent">₹4,52,399</p>
                <p className="text-zinc-500">This Year</p>
              </div>
              <Sun className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-zinc-500 mt-2">+12% from last quarter</p>
          </CardContent>
        </Card>

        {/* Total Orders Card */}
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div>
                <p className="text-3xl font-bold text-primary">1,247</p>
                <p className="text-zinc-500">Total Orders</p>
              </div>
              <Building className="h-6 w-6 text-primary" />
            </div>
            <p className="text-zinc-500 mt-2">+8.5% from last month</p>
          </CardContent>
        </Card>

        {/* Active Orders Card */}
        <Card>
          <CardHeader>
            <CardTitle>Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div>
                <p className="text-3xl font-bold text-green-600">243</p>
                <p className="text-zinc-500">In Progress</p>
              </div>
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-zinc-500 mt-2">Currently being built</p>
          </CardContent>
        </Card>

      </div>

      {/* Recent Orders Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg border-border">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 text-left text-zinc-500 font-medium">Order #</th>
                <th className="p-3 text-left text-zinc-500 font-medium">Customer</th>
                <th className="p-3 text-left text-zinc-500 font-medium">Amount</th>
                <th className="p-3 text-left text-zinc-500 font-medium">Status</th>
                <th className="p-3 text-left text-zinc-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-primary/5 transition-colors">
                <td className="p-3">OF-001</td>
                <td className="p-3">Rajesh Kumar</td>
                <td className="p-3">₹14,999</td>
                <td className="p-3">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Paid</span>
                </td>
                <td className="p-3">2 days ago</td>
              </tr>
              <tr className="border-b border-border hover:bg-primary/5 transition-colors">
                <td className="p-3">OF-002</td>
                <td className="p-3">Priya Singh</td>
                <td className="p-3">₹7,999</td>
                <td className="p-3">
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Pending Payment</span>
                </td>
                <td className="p-3">5 days ago</td>
              </tr>
              <tr className="border-b border-border hover:bg-primary/5 transition-colors">
                <td className="p-3">OF-003</td>
                <td className="p-3">Amit Patel</td>
                <td className="p-3">₹29,999</td>
                <td className="p-3">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">In Progress</span>
                </td>
                <td className="p-3">7 days ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversion Rate Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-accent">3.2%</p>
              <p className="text-zinc-500">Visitor to Order</p>
            </div>
            <p className="text-zinc-500 mt-2">Industry average: 1.8%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">₹18,499</p>
              <p className="text-zinc-500">Per Order</p>
            </div>
            <p className="text-zinc-500 mt-2">Includes all packages</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}