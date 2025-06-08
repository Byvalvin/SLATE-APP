import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getAccessToken } from '@/utils/token';
import { servers } from '@/constants/API';

const PAGE_SIZE = 20;

interface Exercise {
    exerciseId: string;
    name: string;
    image_url?: string;
    realistic_image_url?: string;
    primary_muscles?: string[];
    secondary_muscles?: string[];
    [key: string]: any; // Optional: allows flexibility
  }
  

  const ExerciseResultsScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const query = typeof params.query === 'string' ? params.query : '';
    const category = typeof params.category === 'string' ? params.category : '';
  
    const [results, setResults] = useState<Exercise[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
  
    const fetchResults = async () => {
      setLoading(true);
      const token = await getAccessToken();
      const url = `${servers[2]}/api/exercises/search?query=${query}&category=${category}&page=${page}&limit=${PAGE_SIZE}`;
  
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
  
        if (page === 1) {
          setResults(data.data);
        } else {
          setResults((prev) => [...prev, ...data.data]);
        }
  
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Failed to fetch results', err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      setPage(1); // Reset to page 1 when query/category changes
    }, [query, category]);
  
    useEffect(() => {
        console.log('Received query:', query);
        console.log('Received category:', category);
        fetchResults();
      }, [query, category, page]);
      
  
    const loadMore = () => {
      if (page < totalPages) setPage(page + 1);
    };
  
    const renderItem = ({ item }: { item: Exercise }) => (
      <View style={{ padding: 10 }}>
        <Text>{item.name}</Text>
      </View>
    );
  
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Results for "{query}" {category ? `in ${category}` : ''}
        </Text>
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.exerciseId}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
        />
      </View>
    );
  };
  

export default ExerciseResultsScreen;
