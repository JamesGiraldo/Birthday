import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import firebase from "../utils/firebase";
import { validateEmail } from '../utils/validations';

export default function LoginForm(props) {
    const { changeForm } = props;
    const [formData, setFormData] = useState(defaultValue());
    const [formError, setformError] = useState({});
    const [loading, setLoading] = useState(false);

    const login = async () => {
        setLoading(true);
        let errors = {};
        if (!formData.email || !formData.password) {
            if (!formData.email) errors.email = true;
            if (!formData.password) errors.password = true;
        }
        if (!validateEmail(formData.email)) errors.email = true;
        if (formData.password.length < 6) errors.password = true;

        await firebase.auth()
            .signInWithEmailAndPassword(formData.email, formData.password)
            .then(() => { setLoading(false) })
            .catch((e) => {
                setLoading(false);
                setformError({ email: true, password: true })
            })
        setformError(errors);
    }

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text });
    }

    return (
        <>
            <TextInput
                style={[styles.input, formError.email && styles.error]}
                onChange={(e) => onChange(e, 'email')}
                placeholderTextColor="#969696"
                placeholder="Email"
            />
            <TextInput
                style={[styles.input, formError.password && styles.error]}
                onChange={(e) => onChange(e, 'password')}
                placeholderTextColor="#969696"
                placeholder="Contraseña"
                secureTextEntry={true}
            />
            <Text style={styles.textoWhiet}>{loading ? <ActivityIndicator size="large" color="#0000ff" /> : ''}</Text>
            <TouchableOpacity onPress={login}>
                <Text style={styles.btnText}> Iniciar Sesion </Text>
            </TouchableOpacity>
            <View style={styles.register}>
                <TouchableOpacity onPress={changeForm}>
                    <Text style={styles.btnText}> Registrate </Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

function defaultValue() {
    return { email: '', password: '' };
}

const styles = StyleSheet.create({
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        color: '#fff',
        width: '80%',
        marginBottom: 25,
        backgroundColor: '#1e3040',
        paddingHorizontal: 20,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#1e3040',
    },
    register: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 15
    },
    error: {
        borderColor: '#940c0c'
    },
    textoWhiet: {
        color: '#fff',
        fontSize: 18,
    },
    horizontal: {
        marginBottom: 8,
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
})