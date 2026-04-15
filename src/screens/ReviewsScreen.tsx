import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import tw from '../lib/tailwind';
import { Star, Filter, ChevronDown, TrendingUp, MessageSquare, ThumbsUp } from 'lucide-react-native';

const reviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    avatar: 'https://i.pravatar.cc/150?img=47',
    rating: 5,
    date: 'Apr 10, 2026',
    comment: 'Absolutely love this app! The interface is clean and everything works flawlessly. Customer support was super responsive too.',
    product: 'Premium Plan',
    helpful: 24,
  },
  {
    id: 2,
    name: 'Rahul Mehta',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 4,
    date: 'Apr 8, 2026',
    comment: 'Great experience overall. A few minor bugs here and there but the team fixes them quickly. Would recommend to others.',
    product: 'Basic Plan',
    helpful: 17,
  },
  {
    id: 3,
    name: 'Ananya Patel',
    avatar: 'https://i.pravatar.cc/150?img=32',
    rating: 5,
    date: 'Apr 6, 2026',
    comment: 'Best purchase I ve made this year. The features are exactly what I needed for my small business.',
    product: 'Business Plan',
    helpful: 31,
  },
  {
    id: 4,
    name: 'Karan Joshi',
    avatar: 'https://i.pravatar.cc/150?img=68',
    rating: 3,
    date: 'Apr 4, 2026',
    comment: 'Decent product but needs improvement in the notification area. Sometimes they do not come through on time.',
    product: 'Basic Plan',
    helpful: 8,
  },
  {
    id: 5,
    name: 'Meera Iyer',
    avatar: 'https://i.pravatar.cc/150?img=25',
    rating: 5,
    date: 'Apr 2, 2026',
    comment: 'Exceptional quality and service! Have been using it for 6 months now and it just keeps getting better.',
    product: 'Premium Plan',
    helpful: 42,
  },
  {
    id: 6,
    name: 'Arjun Singh',
    avatar: 'https://i.pravatar.cc/150?img=53',
    rating: 2,
    date: 'Mar 30, 2026',
    comment: 'Had some issues during onboarding. The setup process is a bit confusing for new users.',
    product: 'Basic Plan',
    helpful: 5,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 128, percent: 64 },
  { stars: 4, count: 52, percent: 26 },
  { stars: 3, count: 14, percent: 7 },
  { stars: 2, count: 4, percent: 2 },
  { stars: 1, count: 2, percent: 1 },
];

const StarRow = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <View style={tw`flex-row gap-0.5`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        color={s <= rating ? '#F59E0B' : '#CBD5E1'}
        fill={s <= rating ? '#F59E0B' : 'transparent'}
      />
    ))}
  </View>
);

const ReviewsScreen = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', '5★', '4★', '3★', '2★', '1★'];

  const filteredReviews =
    activeFilter === 'All'
      ? reviews
      : reviews.filter((r) => r.rating === parseInt(activeFilter));

  return (
    <View style={tw`flex-1 bg-blue-50`}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={tw`bg-blue-700 px-5 pt-12 pb-6`}>
          <Text style={tw`text-white text-2xl font-bold tracking-tight mb-1`}>Reviews & Ratings</Text>
          <Text style={tw`text-blue-200 text-sm`}>Monitor what your customers are saying</Text>
        </View>

        {/* Stats Row */}
        <View style={tw`flex-row mx-4 -mt-5 gap-3`}>
          {[
            { icon: Star, label: 'Avg Rating', value: '4.6', color: 'bg-amber-500' },
            { icon: MessageSquare, label: 'Total Reviews', value: '200', color: 'bg-blue-600' },
            { icon: TrendingUp, label: 'This Month', value: '+18', color: 'bg-emerald-500' },
          ].map(({ icon: Icon, label, value, color }) => (
            <View key={label} style={tw`flex-1 bg-white rounded-2xl p-3 shadow-sm`}>
              <View style={tw`${color} w-8 h-8 rounded-xl items-center justify-center mb-2`}>
                <Icon size={16} color="#fff" />
              </View>
              <Text style={tw`text-slate-800 text-lg font-bold`}>{value}</Text>
              <Text style={tw`text-slate-400 text-xs`}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Rating Breakdown */}
        <View style={tw`mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm`}>
          <Text style={tw`text-slate-800 font-bold text-base mb-4`}>Rating Breakdown</Text>
          <View style={tw`flex-row items-center gap-4`}>
            {/* Big Score */}
            <View style={tw`items-center justify-center w-20`}>
              <Text style={tw`text-5xl font-bold text-blue-700`}>4.6</Text>
              <StarRow rating={5} size={12} />
              <Text style={tw`text-slate-400 text-xs mt-1`}>200 reviews</Text>
            </View>

            {/* Bars */}
            <View style={tw`flex-1 gap-1.5`}>
              {ratingBreakdown.map(({ stars, percent }) => (
                <View key={stars} style={tw`flex-row items-center gap-2`}>
                  <Text style={tw`text-slate-500 text-xs w-4`}>{stars}</Text>
                  <View style={tw`flex-1 h-2 bg-blue-50 rounded-full overflow-hidden`}>
                    <View
                      style={[
                        tw`h-full rounded-full`,
                        {
                          width: `${percent}%`,
                          backgroundColor: stars >= 4 ? '#3B82F6' : stars === 3 ? '#93C5FD' : '#FCA5A5',
                        },
                      ]}
                    />
                  </View>
                  <Text style={tw`text-slate-400 text-xs w-7 text-right`}>{percent}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`px-4 py-3 gap-2`}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={tw`px-4 py-1.5 rounded-full border ${activeFilter === f
                ? 'bg-blue-600 border-blue-600'
                : 'bg-white border-blue-100'
                }`}
            >
              <Text
                style={tw`text-sm font-medium ${activeFilter === f ? 'text-white' : 'text-blue-600'
                  }`}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Review Cards */}
        <View style={tw`px-4 gap-3 pb-8`}>
          {filteredReviews.map((review) => (
            <View key={review.id} style={tw`bg-white rounded-2xl p-4 shadow-sm`}>
              {/* Top row */}
              <View style={tw`flex-row items-center justify-between mb-3`}>
                <View style={tw`flex-row items-center gap-3`}>
                  <View style={tw`w-10 h-10 rounded-full bg-blue-100 items-center justify-center`}>
                    <Text style={tw`text-blue-700 font-bold text-lg`}>
                      {review.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={tw`text-slate-800 font-semibold text-sm`}>{review.name}</Text>
                    <Text style={tw`text-slate-400 text-xs`}>{review.date}</Text>
                  </View>
                </View>

              </View>

              {/* Stars */}
              <StarRow rating={review.rating} size={14} />

              {/* Comment */}
              <Text style={tw`text-slate-600 text-sm mt-2 leading-5`}>{review.comment}</Text>

              {/* Footer */}
              <View style={tw`flex-row items-center mt-3 pt-3 border-t border-slate-50`}>

                <View style={tw`flex-row items-center ml-auto`}>
                  <View
                    style={tw`w-2 h-2 rounded-full mr-1.5 ${review.rating >= 4
                      ? 'bg-emerald-400'
                      : review.rating === 3
                        ? 'bg-amber-400'
                        : 'bg-red-400'
                      }`}
                  />
                  <Text
                    style={tw`text-xs ${review.rating >= 4
                      ? 'text-emerald-500'
                      : review.rating === 3
                        ? 'text-amber-500'
                        : 'text-red-500'
                      }`}
                  >
                    {review.rating >= 4 ? 'Positive' : review.rating === 3 ? 'Neutral' : 'Negative'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

export default ReviewsScreen;