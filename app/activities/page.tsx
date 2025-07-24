// /*
// /**
//  * 최근 활동 페이지
//  * 
//  * 사용자의 모든 활동 내역을 보여주는 페이지입니다.
//  * 팩트북 생성, 전략 생성 등의 활동을 시간순으로 표시합니다.
//  */

// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { ArrowLeft, FileText, Target, Plus, Filter } from "lucide-react"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// // 활동 타입 정의
// type ActivityType = "factbook" | "strategy"

// // 활동 데이터 타입 정의
// interface Activity {
//   id: number
//   type: ActivityType
//   title: string
//   description: string
//   date: string
//   status: "completed" | "in_progress"
//   brandName: string
//   industry: string
// }

// // 더미 데이터
// const activities: Activity[] = [
//   {
//     id: 1,
//     type: "factbook",
//     title: "스타벅스 코리아 팩트북",
//     description: "프리미엄 커피 브랜드의 한국 시장 진출 전략을 위한 종합 팩트북",
//     date: "2024-02-15",
//     status: "completed",
//     brandName: "스타벅스 코리아",
//     industry: "식품/음료",
//   },
//   {
//     id: 2,
//     type: "strategy",
//     title: "TV 광고 전략",
//     description: "브랜드 인지도 향상을 위한 TV 광고 캠페인 전략",
//     date: "2024-02-14",
//     status: "completed",
//     brandName: "스타벅스 코리아",
//     industry: "식품/음료",
//   },
//   {
//     id: 3,
//     type: "factbook",
//     title: "나이키 러닝 팩트북",
//     description: "러닝 전문 브랜드로서의 포지셔닝과 MZ세대 타겟팅 전략",
//     date: "2024-02-10",
//     status: "completed",
//     brandName: "나이키 러닝",
//     industry: "패션/뷰티",
//   },
//   {
//     id: 4,
//     type: "strategy",
//     title: "SNS 콘텐츠 전략",
//     description: "소셜미디어 플랫폼별 맞춤 콘텐츠 전략",
//     date: "2024-02-08",
//     status: "completed",
//     brandName: "나이키 러닝",
//     industry: "패션/뷰티",
//   },
//   {
//     id: 5,
//     type: "factbook",
//     title: "올리브영 팩트북",
//     description: "K-뷰티 리테일러의 온라인/오프라인 통합 마케팅 전략",
//     date: "2024-02-05",
//     status: "in_progress",
//     brandName: "올리브영",
//     industry: "패션/뷰티",
//   },
// ]

// export default function ActivitiesPage() {
//   const router = useRouter()
//   const [filter, setFilter] = useState<"all" | ActivityType>("all")
//   const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest")

//   // 필터링 및 정렬된 활동 목록
//   const filteredActivities = activities
//     .filter((activity) => filter === "all" || activity.type === filter)
//     .sort((a, b) => {
//       const dateA = new Date(a.date).getTime()
//       const dateB = new Date(b.date).getTime()
//       return sortBy === "latest" ? dateB - dateA : dateA - dateB
//     })

//   // 활동 타입에 따른 아이콘과 색상
//   const getActivityStyle = (type: ActivityType) => {
//     switch (type) {
//       case "factbook":
//         return {
//           icon: <FileText className="h-5 w-5 text-blue-500" />,
//           bgColor: "bg-blue-50",
//           borderColor: "border-blue-200",
//           textColor: "text-blue-700",
//         }
//       case "strategy":
//         return {
//           icon: <Target className="h-5 w-5 text-purple-500" />,
//           bgColor: "bg-purple-50",
//           borderColor: "border-purple-200",
//           textColor: "text-purple-700",
//         }
//     }
//   }

//   return (
//     <div className="container mx-auto py-8 px-4 max-w-4xl">
//       {/* 헤더 */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center space-x-4">
//           <Button variant="outline" size="icon" onClick={() => router.back()}>
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <h1 className="text-2xl font-bold">최근 활동</h1>
//         </div>
//         <Button onClick={() => router.push("/create-factbook")}>
//           <Plus className="h-4 w-4 mr-2" />
//           새 팩트북 만들기
//         </Button>
//       </div>

//       {/* 필터 및 정렬 */}
//       <div className="flex items-center space-x-4 mb-6">
//         <div className="flex items-center space-x-2">
//           <Filter className="h-4 w-4 text-gray-500" />
//           <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="활동 유형" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">모든 활동</SelectItem>
//               <SelectItem value="factbook">팩트북</SelectItem>
//               <SelectItem value="strategy">전략</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="정렬 기준" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="latest">최신순</SelectItem>
//             <SelectItem value="oldest">오래된순</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* 활동 목록 */}
//       <div className="space-y-4">
//         {filteredActivities.map((activity) => {
//           const style = getActivityStyle(activity.type)
//           return (
//             <Card
//               key={activity.id}
//               className={`border-2 ${style.borderColor} hover:shadow-md transition-shadow cursor-pointer`}
//               onClick={() => {
//                 if (activity.type === "factbook") {
//                   router.push(`/factbook/${activity.id}`)
//                 } else {
//                   router.push(`/strategy/${activity.id}`)
//                 }
//               }}
//             >
//               <CardContent className="p-6">
//                 <div className="flex items-start space-x-4">
//                   <div className={`p-2 rounded-lg ${style.bgColor}`}>
//                     {style.icon}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="font-semibold text-lg">{activity.title}</h3>
//                       <span className={`text-sm px-2 py-1 rounded-full ${style.bgColor} ${style.textColor}`}>
//                         {activity.type === "factbook" ? "팩트북" : "전략"}
//                       </span>
//                     </div>
//                     <p className="text-gray-600 mb-3">{activity.description}</p>
//                     <div className="flex items-center space-x-4 text-sm text-gray-500">
//                       <span className="px-2 py-1 bg-gray-100 rounded-full">
//                         {activity.brandName}
//                       </span>
//                       <span>{activity.industry}</span>
//                       <span>{activity.date}</span>
//                       {activity.status === "in_progress" && (
//                         <span className="text-yellow-600">작성 중</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>
//     </div>
//   )
// } 