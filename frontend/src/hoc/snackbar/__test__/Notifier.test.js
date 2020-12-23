import React from "react"
import {render} from '@testing-library/react'

import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import Notifier from "../Notifier";
import {removeSnackbar} from '../snackBarActions';

jest.mock('react-redux',()=>{
    const dispatch = jest.fn();
    return {
        useSelector : jest.fn((fn)=> fn({snackBar:{notifications:[]}})),
        useDispatch: ()=> dispatch
    }
})

jest.mock('notistack',()=>{
    const  snackbarContext ={enqueueSnackbar: jest.fn(), closeSnackbar: jest.fn()}
    return {
        useSnackbar:() =>snackbarContext
    }
})

describe('notifier',()=>{
    const notification = {message: "success", key: "1"};
    afterEach(()=>{
        useSnackbar().enqueueSnackbar.mock.calls[0][1].onExited({}, notification.key)
        jest.clearAllMocks()

    })

    it("should enqueue all the messages from store",()=>{
       const  {enqueueSnackbar} = useSnackbar()
        useSelector.mockReturnValue([notification])

        render(<Notifier />)
        expect(enqueueSnackbar).toHaveBeenCalledWith("success", expect.anything())
    })

    it("should not show duplicate message ",()=>{
        const  {enqueueSnackbar} = useSnackbar()
        useSelector.mockReturnValue([notification, notification])

        render(<Notifier />)
        expect(enqueueSnackbar).toBeCalledTimes(1)
    })

    it("should remove message on exit",()=>{
        const dispatch = useDispatch()
        const  {enqueueSnackbar} = useSnackbar()
        useSelector.mockReturnValue([notification])

        let onExited
        let onClose;
        enqueueSnackbar.mockImplementation((msg, options)=>{
            onExited =  options.onExited;
            onClose =  options.onClose;
        })
        render(<Notifier />)
        onClose({}, notification.key)
        onExited({}, notification.key)

        expect(dispatch).toHaveBeenCalledWith(removeSnackbar(notification.key))
    })
    
    it("should call onClose on message close when present ",()=>{
        const  {enqueueSnackbar} = useSnackbar()

        const onCloseMock = jest.fn()
        const notificationWithClose = {message: "success", key: "1", options: { onClose: onCloseMock}};
        useSelector.mockReturnValue([notificationWithClose])
        let onCloseHandler;

        enqueueSnackbar.mockImplementation((msg, options)=>{
            onCloseHandler =  options.onClose;
        })
        render(<Notifier />)

        onCloseHandler({}, {},notificationWithClose.key)
        expect(onCloseMock).toHaveBeenCalled()
    })

})