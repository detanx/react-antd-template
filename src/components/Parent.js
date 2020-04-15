import React, { useState } from "react"
import context from "./context"
import Child from "./Child"
import "./test.less"

export default function Parent() {
  const [name, setName] = useState("detanx")
  return (
    <div className="test">
      时间：{name}
      <context.Provider value={setName}>
        <Child />
      </context.Provider>
    </div>
  )
}
