import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

interface MenuProps {
  visible: boolean;
  anchor: React.ReactNode;
  children: React.ReactNode;
  onDismiss: () => void;
}

interface MenuItemProps {
  onPress: () => void;
  title: string;
  icon?: React.ReactNode;
  titleStyle?: object;
}

export function Menu({ visible, anchor, children, onDismiss }: MenuProps) {
  return (
    <View>
      {anchor}
      <Modal visible={visible} transparent onRequestClose={onDismiss}>
        <Pressable style={styles.overlay} onPress={onDismiss}>
          <View style={styles.menu}>
            {children}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export function MenuItem({ onPress, title, icon, titleStyle }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.menuText, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    minWidth: 150,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  icon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
  },
});