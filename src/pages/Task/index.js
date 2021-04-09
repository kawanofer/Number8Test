import React, { useState, useEffect } from "react";
import { clone, isEmpty, find, filter } from "lodash";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import * as moment from "moment";

import {
	Checkbox,
	IconButton,
	Button,
	TextField,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import { Container } from "./styles";

export default function Task() {
	const [tasksData, setTasksData] = useState([]);
	const [open, setOpen] = useState(false);
	const [edit, setEdit] = useState(null);

	useEffect(() => {
		console.log("tasksData: ", tasksData);
	}, [tasksData]);

	//
	// FORM VALIDATION SCHEMA
	const schema = yup.object().shape({
		name: yup.string().required(" required"),
		date: yup.date().required().typeError(" required"),
	});
	//
	const { register, reset, handleSubmit, setValue, errors } = useForm({
		defaultValues: {
			name: "",
			date: null,
		},
		validationSchema: schema,
	});

	// OPEN DIALOG
	const handleOpen = () => {
		setEdit(null);
		setOpen(true);
	};

	// CLOSE DIALOG
	const handleClose = () => {
		setOpen(false);
		reset();
	};

	// CHANGE CHECKBOX STATUS
	const handleChange = (event, row) => {
		let newItems = tasksData.map((item) => {
			if (item.id === row.id) {
				if (item.status === "done") {
					item.status = "do";
				} else {
					item.status = "done";
				}
			}
			return item;
		});

		setTasksData(newItems);
	};

	// SUBMIT TASK
	const onSubmit = (data) => {
		const { name, date } = data;
		debugger;
		if (!isEmpty(edit)) {
			const tasks = tasksData.map((item) => {
				if (item.id === edit.id) {
					const updatedItem = {
						...item,
						name,
						date,
					};

					return updatedItem;
				}

				return item;
			});
			console.log("updated ", tasks);
			setTasksData(tasks);
		} else {
			let obj = {
				id: uuidv4(),
				name,
				date,
				status: "do",
			};
			//
			const tasks = clone(tasksData);
			tasks.push(obj);
			setTasksData(tasks);
		}
		//
		setOpen(false);
	};

	// EDIT TASK
	const handleEdit = (item) => {
		setEdit(item);
		setOpen(true);
	};

	useEffect(() => {
		debugger;
		if (open && !isEmpty(edit)) {
			let d = moment(edit.date).format("yyyy-MM-DD");
			console.log(d);
			setTimeout(() => {
				setValue("name", edit.name);
				setValue("date", d);
			}, 500);
		}
	}, [open, edit]);

	// DELETE TASK
	const handleDelete = (row) => {
		const tasks = filter(tasksData, (task) => task.id !== row.id);
		setTasksData(tasks);
	};

	return (
		<Container>
			<h1>TASKS</h1>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell width="10%">Check</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filter(tasksData, ["status", "do"]).map((row) => (
							<TableRow key={row.name}>
								<TableCell component="th" scope="row">
									<Checkbox
										color="primary"
										onChange={() => handleChange(this, row)}
										inputProps={{
											"aria-label": "secondary checkbox",
										}}
									/>
								</TableCell>
								<TableCell title={moment(row.date).format("L")}>
									{row.name}
								</TableCell>
								<TableCell>
									<IconButton aria-label="edit">
										<EditIcon
											onClick={() => handleEdit(row)}
										/>
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{isEmpty(filter(tasksData, ["status", "do"])) && (
					<div className="noData">
						<h3>No items to show</h3>
					</div>
				)}
			</TableContainer>

			<Divider variant="fullWidth" className="divider" />

			<h1>COMPLETED TASKS</h1>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell width="10%">Check</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filter(tasksData, ["status", "done"]).map((row) => (
							<TableRow key={row.name}>
								<TableCell component="th" scope="row">
									<Checkbox
										color="primary"
										checked={row.status === "done"}
										onChange={() => handleChange(this, row)}
										inputProps={{
											"aria-label": "secondary checkbox",
										}}
									/>
								</TableCell>
								<TableCell title={moment(row.date).format("L")}>
									{row.name}
								</TableCell>
								<TableCell>
									<IconButton aria-label="delete">
										<DeleteIcon
											onClick={() => handleDelete(row)}
										/>
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{isEmpty(filter(tasksData, ["status", "done"])) && (
					<div className="noData">
						<h3>No items to show</h3>
					</div>
				)}
			</TableContainer>

			<Divider variant="fullWidth" className="divider" />

			<Button
				variant="contained"
				color="primary"
				onClick={handleOpen}
				fullWidth={true}
			>
				Add New Task
			</Button>

			{/* DIALOG - FORM */}
			<Dialog
				open={open}
				fullWidth={true}
				maxWidth={"sm"}
				onClose={handleOpen}
				aria-labelledby="max-width-dialog-title"
			>
				<DialogTitle id="max-width-dialog-title">NEW TASK</DialogTitle>
				<DialogContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Grid container spacing={2}>
							<Grid item md={12}>
								<label>Name</label>
								<TextField
									name="name"
									label=""
									inputRef={register}
									fullWidth
									error={errors.name}
									helperText={
										errors.name && errors.name.message
									}
								/>
							</Grid>

							<Grid item md={12}>
								<label>Date</label>
								<TextField
									name="date"
									label=""
									type="date"
									inputRef={register}
									fullWidth
									error={errors.date}
									helperText={
										errors.date && errors.date.message
									}
								/>
							</Grid>
						</Grid>

						<Grid
							item
							xs={12}
							container
							justify="flex-end"
							style={{ marginTop: "28px" }}
						>
							<Grid item>
								<Button
									style={{ marginRight: "8px" }}
									onClick={handleClose}
									variant="outlined"
								>
									Cancel
								</Button>

								<Button
									variant="contained"
									color="primary"
									type="submit"
								>
									Save
								</Button>
							</Grid>
						</Grid>
					</form>
				</DialogContent>
			</Dialog>
		</Container>
	);
}
