import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getProducts, saveProducts } from '@/app/utils/storage';
import type { Product } from '@/app/types';

export default function EditProduct() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    const products = await getProducts();
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setName(foundProduct.name);
      setBuyPrice(foundProduct.buyPrice);
      setSellPrice(foundProduct.sellPrice);
      setQuantity(foundProduct.quantity);
      setImage(foundProduct.image);
    }
  }

  async function pickImage() {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        alert('Permission to access media library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const manipResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 300 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        setImage(manipResult.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    }
  }

  async function handleSubmit() {
    if (!name) {
      alert('Product name is required');
      return;
    }

    if (!product) {
      return;
    }

    const products = await getProducts();
    const updatedProducts = products.map(p => 
      p.id === id 
        ? { ...p, name, buyPrice, sellPrice, quantity, image }
        : p
    );

    await saveProducts(updatedProducts);
    router.back();
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Camera size={32} color="#666" />
            <Text style={styles.placeholderText}>Change Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Buy Price"
        keyboardType="decimal-pad"
        value={buyPrice}
        onChangeText={setBuyPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="Sell Price"
        keyboardType="decimal-pad"
        value={sellPrice}
        onChangeText={setSellPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  imageButton: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: '#666',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: 'red',
  },
});