<script>
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { read, utils } from 'xlsx';
	import { assignments } from '../store/assignments';
	import { goto } from '$app/navigation';

	let file;
	let filtered_students = 0;
	let implicit_zeros = 0;
	let data_processed = false;

	function cleanData(assignment_data) {
		const original_num_students = assignment_data.length;
		const question_names = Object.keys(assignment_data[0]);
		// Filter out students with no score overall
		assignment_data.filter((student) => {
			return (
				question_names.reduce((question_name, acc) => {
					return (acc += student[question_name]);
				}, 0) > 0
			);
		});
		filtered_students = original_num_students - assignment_data.length;

		// Add implicit 0s
		assignment_data.forEach((student) => {
			question_names.forEach((question_name) => {
				if (student[question_name] == undefined) {
					student[question_name] = 0;
					implicit_zeros++;
				}
			});
		});
		return assignment_data;
	}

	async function fileProvided(e) {
		e.stopPropagation();
		e.preventDefault();
		const data = await e.dataTransfer.files[0].arrayBuffer();
		const workbook = read(data);
		let all_assignments = [];
		workbook.SheetNames.forEach((sheetname) => {
			const json_data = utils.sheet_to_json(workbook.Sheets[sheetname]);
			let assignment_data = cleanData(json_data);
			all_assignments.push({
				name: sheetname,
				data: assignment_data
			});
		});
		$assignments = all_assignments;
		data_processed = true;
		//goto('/analytics');
	}
</script>

<div class="container h-full mx-auto flex flex-col justify-center items-center">
	{#if !data_processed}
		<div class="space-y-10 text-center flex flex-col items-center">
			<h2 class="h2">Welcome to Psychometrics Made Simple</h2>
			<h4 class="h4">Please drag in your grades file to get started</h4>
		</div>
		<div class="file-drop">
			<FileDropzone name="files" bind:files={file} on:drop={fileProvided} />
		</div>
	{:else}
		<div class="flex flex-col justify-center items-center">
			<div class="h3">Data processed successfully!</div>
			<div class="h4">Students removed: {filtered_students}</div>
			<div class="h4">Implicit zeroes added: {implicit_zeros}</div>
			<a href="/analytics" class="button">Continue to Analysis</a>
		</div>
	{/if}
</div>

<style lang="postcss">
	.file-drop {
		margin-top: 20px;
	}

	.button {
		margin-top: 25px;
		padding: 15px 25px;
		border-radius: 4px;
		background-color: #f4f4f4;
		color: #000;
		cursor: pointer;
	}
</style>
