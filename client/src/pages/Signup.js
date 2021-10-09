import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { ADD_USER } from "../utils/mutations";

const Signup = () => {

    const [addUser] = useMutation(ADD_USER);
    const securityQuestionsOne = [
        'In what city were you born?',
        'What is the name of your favorite pet?',
        'What is your mother\'s maiden name?',
        'What high school did you attend?',
        'What was the make of your first car?'
    ]

    const [securityQuestionsTwo, setSecurityQuestionsTwo] = useState(
        [
            'In what city were you born?',
            'What is the name of your favorite pet?',
            'What is your mother\'s maiden name?',
            'What high school did you attend?',
            'What was the make of your first car?'
        ]
    )

    const [formState, setFormState] = useState({
        username: '',
        email: '',
        password: '',
        questionOne: '',
        answerOne: '',
        questionTwo: '',
        answerTwo: ''
    })

    // update security questions 2 array to remove first question once user selects first question
    useEffect(() => {
        const { questionOne } = formState;
        const updatedSecurityTwoQuestions = securityQuestionsOne.filter(question => question !== questionOne);

        setSecurityQuestionsTwo(updatedSecurityTwoQuestions);

    }, [formState.questionOne])

    // collect user inputs
    const handleChange = event => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value,
        })
    }

    // collect questions user selects for security questions
    const handleClick = event => {
        const { id, value } = event.target

        setFormState({
            ...formState,
            [id]: value
        })
    }

    // submit the collected data from user to create a new user and add them to the db
    const handleFormSubmit = async event => {
        event.preventDefault();
        const mutationResponse = await addUser({
            variables: {
                email: formState.email,
                username: formState.username,
                password: formState.password,
                questionOne: formState.questionOne,
                answerOne: formState.answerOne,
                questionTwo: formState.questionTwo,
                answerTwo: formState.answerTwo
            }
        });
        const token = mutationResponse.data.addUser.token;
        Auth.login(token);

    }

    return (
        <section>
            <Link to="/login">← Go to Login</Link>
            <h1>Sign Up</h1>

            <form onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        name='username'
                        type="username"
                        id="username"
                        placeholder="Username"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="email">E-mail:</label>
                    <input
                        name='email'
                        type="email"
                        id="email"
                        placeholder="Email"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        name='password'
                        type="password"
                        id="password"
                        placeholder="Password"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <select id='questionOne' onClick={handleClick}>
                        <option value='select'>Select Security Question 1</option>
                        {securityQuestionsOne.map((question, index) => {
                            return <option
                                value={question}
                                key={index}
                            >
                                {question}
                            </option>
                        })}
                    </select>
                    <label htmlFor="answerOne"></label>
                    <input
                        name='answerOne'
                        type="answerOne"
                        id="answerOne"
                        placeholder="Answer"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <select id='questionTwo' onClick={handleClick}>
                        <option value='select'>Select Security Question 2</option>
                        {securityQuestionsTwo.map((question, index) => {
                            return <option
                                value={question}
                                key={index}
                            >
                                {question}
                            </option>
                        })}
                    </select>
                    <label htmlFor="answerTwo"></label>
                    <input
                        name='answerTwo'
                        type="answerTwo"
                        id="answerTwo"
                        placeholder="Answer"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <button type="submit">Signup</button>
                </div>
            </form>
        </section>
    )
}

export default Signup;