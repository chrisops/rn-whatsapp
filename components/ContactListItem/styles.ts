import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container:{
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    flex: 1,
    padding: 10,
    marginBottom: 10
  },
  leftContainer: {
    flexDirection: 'row'
  },
  midContainer: {
    justifyContent: 'space-evenly'
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 50
  },
  username:{
    fontWeight: 'bold'
  },
  lastMessage: {
    fontSize: 16,
    color: 'grey',
  },
})

export default style