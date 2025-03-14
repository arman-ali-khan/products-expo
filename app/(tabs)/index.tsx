import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react-native';
import { Menu, MenuItem } from '@/components/Menu';
import { getProducts, saveProducts } from '@/app/utils/storage';
import type { Product } from '@/app/types';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const storedProducts = await getProducts();
    setProducts(storedProducts);
  }

  async function handleDelete(id: string) {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedProducts = products.filter(p => p.id !== id);
            await saveProducts(updatedProducts);
            setProducts(updatedProducts);
          },
        },
      ]
    );
  }

  function renderItem({ item }: { item: Product }) {
    return (
      <View style={styles.item}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          defaultSource={require('@/assets/placeholder.png')}
        />
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>Buy: ${item.buyPrice}</Text>
          <Text style={styles.price}>Sell: ${item.sellPrice}</Text>
          <Text style={styles.quantity}>Qty: {item.quantity}</Text>
        </View>
        <Menu
          visible={selectedProduct === item.id}
          anchor={
            <TouchableOpacity
              onPress={() => setSelectedProduct(item.id)}
              style={styles.menuButton}
            >
              <MoreVertical size={24} />
            </TouchableOpacity>
          }
          onDismiss={() => setSelectedProduct(null)}
        >
          <MenuItem
            onPress={() => {
              setSelectedProduct(null);
              router.push(`/edit/${item.id}`);
            }}
            title="Edit"
            icon={<Edit2 size={20} />}
          />
          <MenuItem
            onPress={() => {
              setSelectedProduct(null);
              handleDelete(item.id);
            }}
            title="Delete"
            icon={<Trash2 size={20} color="red" />}
            titleStyle={{ color: 'red' }}
          />
        </Menu>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {products.length === 0 ? (
        <Text style={styles.empty}>No products added yet</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  menuButton: {
    padding: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#666',
  },
});