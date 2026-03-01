<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            'Laravel',
            'Flutter',
            'AI',
            'Django',
            'Frontend',
            'UI'
        ];

        foreach ($departments as $name) {
            \App\Models\Department::create([
                'name' => $name,
                'slug' => \Illuminate\Support\Str::slug($name)
            ]);
        }
    }
}
