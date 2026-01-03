import { User, useStore } from "../state/useStore"
import { ExpandableTable } from "./ExpandableTable";
import { TableHeader } from "./TableHeader";

export interface userFormProps {

}

export function UsersForm(userFormProps) {
    const { user, articles, loading, users, setUser } = useStore((s) => s);
    return (
     
            user.sensi && users.map((user) => (
                <div className='bUser' key={user._id}>

                    <div className='bRow'>
                        <div className='bItem bLabel'>
                            User Name
                        </div>       <div className='bItem'>
                            {user.userName}
                        </div>
                    </div>

                    <div className='bRow'>

                        <div className='bItem bLabel'>
                            ID
                        </div>
                        <div className='bItem'>
                            {user._id}
                        </div>
                    </div>
                    <div className='bRow'>
                        <div className='bItem bLabel'>
                            Author
                        </div>        <div className='bItem'>
                            {user.author === true && (
                                <>TRUE</>
                            )

                            }
                        </div></div>

                    <div className='bRow'>
                        <div className='bItem bLabel'>
                            Sensi
                        </div>         <div className='bItem'>
                            {user.sensi === true && (
                                <>TRUE</>
                            )}
                            {user.sensi === false && (
                                <>FALSE</>
                            )}
                        </div>
                    </div>
                    <div className='bRow'>
                        <div className='bItem bLabel'>
                            Status
                        </div>        <div className='bItem'>
                            {user.status}
                        </div></div>

                    <div className='bRow'>
                        <div className='bItem bLabel'>
                            Hash
                        </div>       <div className='bItem'>
                            {user.phash}
                        </div>
                    </div>
                    <div className='bRow'>
                        <div className='bItem bLabel'>
                            Email
                        </div>           <div className='bItem'>
                            {user.userEmail}
                        </div></div>

                </div>
            ))
       
    )
}