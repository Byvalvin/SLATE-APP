import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { countries } from '../data/countries'; // Import the countries data

type Props = {
  label: string;
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
};

const FlagPicker = ({ label, selectedCountry, onSelectCountry }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter countries based on search query
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Search for a country"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredCountries}
        keyExtractor={item => item.code}
        renderItem={({ item }) => {
          const flagUrl = `https://flagcdn.com/w320/${item.code.toLowerCase()}.png`; // Construct the flag URL

          return (
            <TouchableOpacity
              style={styles.option}
              onPress={() => onSelectCountry(item.name)}
            >
              <Image source={{ uri: flagUrl }} style={styles.flag} />
              <Text style={styles.optionText}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.noResultsText}>No results found</Text>}
      />

      {selectedCountry && <Text style={styles.selectedCountry}>Selected: {selectedCountry}</Text>}
    </View>
  );
};

export default FlagPicker;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#111827',
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
  selectedCountry: {
    marginTop: 12,
    fontSize: 16,
    color: '#111827',
  },
});
