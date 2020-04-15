/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react"
import { Button, DatePicker } from "antd"
import moment from "moment"
import myContext from "./context"

function Child() {
  const setName = useContext(myContext)
  return (
    <>
      <Button type="primary" onClick={() => setName(new Date().valueOf())}>
        改s变{moment.valueOf()}
      </Button>
      <DatePicker></DatePicker>
      <div>ssww3</div>
    </>
  )
}
export default Child
