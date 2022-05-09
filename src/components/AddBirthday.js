import React, { useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from "react-native";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import dayjs from 'dayjs';
import firebase from "../utils/firebase";
import "firebase/firebase-firestore";

// firebase.firestore().settings({ experimentalForceLongPolling: true });
const db = firebase.firestore(firebase);

export default function AddBirthday(props) {

    const { user, setshowList, setReloadData } = props;
    const [isDatePicketVisible, setisDatePicketVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState({});

    const hideDatePicker = () => {
        setisDatePicketVisible(false);
    }

    const showDatePicker = () => {
        setisDatePicketVisible(true);
    }

    const handlerConfirm = (date) => {
        const dateBirth = date;
        dateBirth.setHours(0);
        dateBirth.setMinutes(0);
        dateBirth.setSeconds(0);
        setFormData({ ...formData, dateBirth });
        hideDatePicker();
    }

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text });
    }

    const onSubmit = async () => {
        let errors = {};
        if (!formData.name || !formData.lastName || !formData.dateBirth) {
            if (!formData.name) errors.name = true;
            if (!formData.lastName) errors.lastName = true;
            if (!formData.dateBirth) errors.dateBirth = true;
        } else {
            const data = formData;
            data.dateBirth.setYear(0)
            await db.collection(user.uid).add(data)
                .then((res) => {
                    setReloadData(true);
                    setshowList(true);
                })
                .catch((e) => {
                    console.log(e)
                    setFormError({ name: true, lastName: true, dateBirth: true })
                })
        }
        setFormError(errors);
    }

    return (
        <>
            <View style={styles.container}>
                <TextInput
                    style={[styles.input, formError.name && styles.error]}
                    placeholderTextColor="#969696"
                    placeholder="Nombre"
                    onChange={(e) => onChange(e, 'name')}
                />
                <TextInput
                    style={[styles.input, formError.lastName && styles.error]}
                    placeholderTextColor="#969696"
                    placeholder="Apellido"
                    onChange={(e) => onChange(e, 'lastName')}
                />

                <View style={[
                    styles.input,
                    styles.datePicker,
                    formError.dateBirth && styles.error]}>
                    <Text
                        onPress={showDatePicker}
                        style={{
                            color: formData.dateBirth ? '#fff' : '#969696',
                            fontSize: 16
                        }}>
                        {
                            formData.dateBirth
                                ? moment(formData.dateBirth).format('LL')
                                : 'Fecha de nacimiento'
                        }
                    </Text>
                </View>
                <TouchableOpacity onPress={onSubmit}>
                    <Text style={styles.addButton}> Crear cumpleaños </Text>
                </TouchableOpacity>
            </View>

            <DateTimePickerModal
                isVisible={isDatePicketVisible}
                mode="date"
                onConfirm={handlerConfirm}
                textColor="dark"
                onCancel={hideDatePicker}
            ></DateTimePickerModal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        height: 50,
        width: "80%",
        color: "#fff",
        marginBottom: 25,
        backgroundColor: "#1e3040",
        paddingHorizontal: 20,
        fontSize: 18,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#1e3040",
    },
    datePicker: {
        justifyContent: "center",
    },
    addButton: {
        fontSize: 18,
        color: "#fff",
    },
    error: {
        borderColor: '#940c0c'
    },
})