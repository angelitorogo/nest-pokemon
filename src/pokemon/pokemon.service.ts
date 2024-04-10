import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor( 
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>, 
    private readonly configService: ConfigService,
  ){
    this.defaultLimit = configService.get<number>('defaultLimit');

    //const port = configService.get<number>('port')
    //console.log(port);
  }

  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {

      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
      
    } catch (error) {

      this.handleExceptions(error);
      
    }

    

  }




  findAll( paginationDto: PaginationDto) {

    const { limit =  this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit( limit )
      .skip( offset )
      .sort({
        no:1
      })
      .select('-__v');


  }




  async findOne(term: string) {

    let pokemon: Pokemon;

    if( !isNaN(+term) ) { //Si es un numero
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    if( !pokemon && isValidObjectId( term ) ) { //Si es un mongoId
      pokemon = await this.pokemonModel.findById( term );
    }
    
    if( !pokemon ) { // si a estas alturas no hay pokemon, se trata de la busqueda por nombre
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }


    if( !pokemon )
      throw new NotFoundException(`El pokemon con id, nombre, o nº "${ term }" no se encuentra en la DB`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( term );

    if( updatePokemonDto.name ) 
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      
      await pokemon.updateOne( updatePokemonDto );
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      
      this.handleExceptions(error);

    }

    

  }

  async remove(id: string) {

    //const pokemon = await this.findOne(id);
    //await pokemon.deleteOne();
    //return {id};
    //const resultado = await this.pokemonModel.findByIdAndDelete( id );

    const { deletedCount, acknowledged } = await this.pokemonModel.deleteOne({ _id: id });

    if( deletedCount === 0) {
      throw new BadRequestException(`El pokemon con id"${ id }" no se encuentra en la DB`)
    }

    return;
    
  }



  private handleExceptions( error: any ) {
    if( error.code === 11000 ) {
      throw new BadRequestException(`Pokemon ya existe en DB ${ JSON.stringify(error.keyValue)}`);
    }

    //console.log(error);
    throw new InternalServerErrorException(`No se pudo crear el Pokemon, consulte logs del servidor`);
  }

}
