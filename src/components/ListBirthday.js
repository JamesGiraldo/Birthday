import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert
} from "react-native";
import firebase from "../utils/firebase";
import "firebase/firebase-firestore";

const db = firebase.firestore(firebase);

/** components */
import ActionBar from "./ActionBar";
import AddBirthday from "./AddBirthday";
import moment from "moment";
import Birthday from "./Birthday";

export default function ListBirthday(props) {
    const { user } = props;
    const [showList, setshowList] = useState(true);
    const [birthdays, setBirthdays] = useState([]);
    const [pasabirthdays, setPasaBirthdays] = useState([]);
    const [reloadData, setReloadData] = useState(false);

    useEffect(() => {
        setBirthdays([]);
        setPasaBirthdays([]);
        db.collection(user.uid).orderBy("dateBirth", "asc").get()
            .then(res => {
                const itemsArray = [];
                res.forEach((doc) => {
                    const data = doc.data();
                    data.id = doc.id;
                    itemsArray.push(data);
                });
                formatData(itemsArray);
            });
        setReloadData(false);
    }, [reloadData]);

    const formatData = (items) => {
        const currentDate = moment().set({
            hour: 0, minute: 0, second: 0, millisecond: 0
        });
        const birthdaysTemporary = [];
        const pasabirthdaysTemporary = [];
        items.forEach(item => {
            const dateBorth = new Date(item.dateBirth.seconds * 1000);
            const dateBirthday = moment(dateBorth);
            const currenYear = moment().get("year");
            dateBirthday.set({ year: currenYear });

            const diffDate = currentDate.diff(dateBirthday, "days");
            const itemTemp = item;
            itemTemp.dateBirth = dateBirthday;
            itemTemp.days = diffDate;
            if (diffDate <= 0) {
                birthdaysTemporary.push(itemTemp);
            } else {
                pasabirthdaysTemporary.push(itemTemp);
            }
        });
        setBirthdays(birthdaysTemporary);
        setPasaBirthdays(pasabirthdaysTemporary);
    }

    const deleteBirthday = (birthday) => {
        Alert.alert(
            'Eliminar cumpleaños',
            `¿Estas seguro de eliminar el cumpleaños de ${birthday.name} ${birthday.lastName}`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    onPress: () => {
                        db.collection(user.uid).doc(birthday.id).delete()
                            .then(() => {
                                setReloadData();
                            });
                    },
                },
            ],
            { cancelable: false },
        );
    };


    return (
        <View style={styles.container}>
            {
                showList ? (
                    <>
                        <ScrollView style={styles.scrollView}>
                            {
                                birthdays.map((item, index) => (
                                    <Birthday
                                        key={index}
                                        birthday={item}
                                        deleteBirthday={deleteBirthday}
                                    />
                                ))
                            }
                            {
                                pasabirthdays.map((item, index) => (
                                    <Birthday
                                        key={index}
                                        birthday={item}
                                        deleteBirthday={deleteBirthday}
                                    />
                                ))
                            }
                        </ScrollView>
                    </>
                ) : (
                    <AddBirthday
                        user={user}
                        setshowList={setshowList}
                        setReloadData={setReloadData}
                    />
                )
            }
            <ActionBar showList={showList} setshowList={setshowList} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        height: "100%"
    },
    scrollView: {
        marginBottom: 50,
        width: "100%"
    }
})