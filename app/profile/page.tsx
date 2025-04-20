'use client';
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, Mail, Package, Settings, Bell } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            My Profile
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="p-6 text-center">
              <div className="mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mx-auto flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold mt-4">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-600">{user?.emailAddresses[0].emailAddress}</p>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <Tabs defaultValue="orders">
                <TabsList className="grid grid-cols-3 gap-4 mb-6">
                  <TabsTrigger value="orders" className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Order #12345</h3>
                          <p className="text-sm text-gray-600">Placed on: 2024-01-20</p>
                        </div>
                        <Button variant="outline">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardContent className="space-y-4 p-4">
                      <div>
                        <label className="text-sm font-medium">Email Notifications</label>
                        <p className="text-sm text-gray-600">Manage your email preferences</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Password</label>
                        <p className="text-sm text-gray-600">Update your password</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications">
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div>
                            <h4 className="font-medium">Order Shipped!</h4>
                            <p className="text-sm text-gray-600">Your order #12345 has been shipped</p>
                          </div>
                          <span className="text-xs text-gray-500">2 hours ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}