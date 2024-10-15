import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { Icon } from "react-native-elements";
import { Modal } from 'antd';
import CustomHeaderShare from "../CustomHeaderShare";

const ShareID = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handleItemPress = () => {
        setModalVisible(true);
    };

    const handleOk = () => {
        consentGiven();
        setModalVisible(false);
        navigation.navigate('FakeDisplay');
      };
    
    const handleCancel = () => {
        setModalVisible(false);
    };

    const consentGiven = () => {
        navigation.navigate('FakeDisplay');
    };

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeaderShare />
            <View>
                <Modal
                    title="Consent Required"
                    visible={modalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Yes"
                    cancelText="No"
                >
                    <p>You are about to share your information with a third party who may retain it. Do you consent?</p>
                </Modal>
                <Text style={styles.header}>What would you like to share?</Text>

                <TouchableOpacity style={styles.item} onPress={handleItemPress}>
                    <View style={styles.itemIcon}>
                        <Icon name="id-card" type="font-awesome-5" size={30} />
                    </View>
                    <View style={styles.itemTextContainer}>
                        <Text style={styles.itemTitle}>Share my Driver Licence</Text>
                        <Text style={styles.itemDescription}>Photo, Name, DoB, Licence No., Class/es, Type/s, Conditions, Status, Expiry date, Address, Signature, Card number</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.item} onPress={handleItemPress}>
                    <View style={styles.itemIcon}>
                        <Icon name="check-circle" type="font-awesome-5" size={30} />
                    </View>
                    <View style={styles.itemTextContainer}>
                        <Text style={styles.itemTitle}>Prove I'm over 18</Text>
                        <Text style={styles.itemDescription}>Photo, Proof you are over 18</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.item} onPress={handleItemPress}>
                    <View style={styles.itemIcon}>
                        <Icon name="user" type="font-awesome-5" size={30} />
                    </View>
                    <View style={styles.itemTextContainer}>
                        <Text style={styles.itemTitle}>Share my identity</Text>
                        <Text style={styles.itemDescription}>Photo, Name, DoB, Licence No., Signature</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.item} onPress={handleItemPress}>
                    <View style={styles.itemIcon}>
                        <Icon name="pdffile1" type="antdesign" size={30} />
                    </View>
                    <View style={styles.itemTextContainer}>
                        <Text style={styles.itemTitle}>Share a printable copy</Text>
                        <Text style={styles.itemDescription}>Photo, Name, DoB, Licence No., Class/es, Type/s, Conditions, Status, Expiry date, Address, Signature, Card number</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f0f0f5",
        margin: 20,
        paddingTop: 80, // Ensure content starts below the sticky header
        borderRadius: 10
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 30,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    itemIcon: {
        marginRight: 15,
        backgroundColor: '#ecc47e',
        padding: 5,
        margin: 5,
        borderRadius: 100
    },
    itemTextContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    itemDescription: {
        color: "#555",
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalButton: {
        flex: 1,
        alignItems: "center",
    },
    modalButtonText: {
        fontSize: 18,
        color: "#007aff",
    },
});

export default ShareID;