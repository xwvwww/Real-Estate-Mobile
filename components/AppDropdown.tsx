import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

export type AppDropdownOption = {
  label: string;
  value: string;
};

type AppDropdownProps = {
  value: string;
  placeholder: string;
  open: boolean;
  options: AppDropdownOption[];
  onToggle: () => void;
  onSelect: (value: string) => void;
  compact?: boolean;
  maxMenuHeight?: number;
  triggerStyle?: StyleProp<ViewStyle>;
  menuStyle?: StyleProp<ViewStyle>;
};

export default function AppDropdown({
  value,
  placeholder,
  open,
  options,
  onToggle,
  onSelect,
  compact = false,
  maxMenuHeight = 220,
  triggerStyle,
  menuStyle,
}: AppDropdownProps) {
  const selectedLabel = options.find((option) => option.value === value)?.label ?? '';

  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.trigger, compact ? styles.triggerCompact : null, triggerStyle]}
        onPress={onToggle}>
        <Text
          style={[
            styles.valueText,
            compact ? styles.valueTextCompact : null,
            !value ? styles.placeholderText : null,
          ]}>
          {value ? selectedLabel : placeholder}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={compact ? 14 : 18} color="#939393" />
      </Pressable>

      {open ? (
        <View style={[styles.menu, compact ? styles.menuCompact : null, { maxHeight: maxMenuHeight }, menuStyle]}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
            {options.map((option, index) => {
              const selected = option.value === value;

              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.item,
                    compact ? styles.itemCompact : null,
                    selected ? styles.itemActive : null,
                    index === options.length - 1 ? styles.itemLast : null,
                  ]}
                  onPress={() => onSelect(option.value)}>
                  <Text
                    style={[
                      styles.itemText,
                      compact ? styles.itemTextCompact : null,
                      selected ? styles.itemTextActive : null,
                    ]}>
                    {option.label}
                  </Text>
                  {selected ? <Ionicons name="checkmark" size={compact ? 16 : 18} color="#70A0FF" /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    zIndex: 10,
  },
  trigger: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  triggerCompact: {
    minWidth: 86,
    height: 30,
    borderWidth: 0,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  valueText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#3A3A3A',
  },
  valueTextCompact: {
    fontSize: 12,
    lineHeight: 18,
  },
  placeholderText: {
    color: '#939393',
  },
  menu: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
    zIndex: 20,
  },
  menuCompact: {
    top: 36,
    width: 96,
    left: 'auto',
    right: 0,
  },
  item: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemCompact: {
    minHeight: 36,
    paddingHorizontal: 10,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemActive: {
    backgroundColor: '#F0F7FF',
  },
  itemText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#3A3A3A',
  },
  itemTextCompact: {
    fontSize: 12,
    lineHeight: 18,
  },
  itemTextActive: {
    color: '#70A0FF',
    fontWeight: '600',
  },
});
